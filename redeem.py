# redeem.py — Tiger Deals Bot
# Redeem code system — Neon PostgreSQL backend
# /code <amount>   → admin generates a one-time code
# /redeem <CODE>   → user redeems it for wallet balance

import random
import string
from database import get_conn
from config import ADMIN_ID


# ══════════════════════════════════════════════════════════════
#  CODE GENERATION
# ══════════════════════════════════════════════════════════════

def _make_code() -> str:
    """Generate a code like XKQZ-7B2M-W9RP."""
    chars = string.ascii_uppercase + string.digits
    return '-'.join(''.join(random.choices(chars, k=4)) for _ in range(3))


def create_redeem_code(amount: float) -> str:
    """Generate a unique code, store it, return the code string."""
    with get_conn() as conn:
        cur = conn.cursor()
        while True:
            code = _make_code()
            cur.execute("SELECT 1 FROM redeem_codes WHERE code = %s", (code,))
            if not cur.fetchone():
                break
        cur.execute(
            "INSERT INTO redeem_codes (code, amount) VALUES (%s, %s)",
            (code, amount)
        )
    return code


# ══════════════════════════════════════════════════════════════
#  CODE REDEMPTION
# ══════════════════════════════════════════════════════════════

def use_redeem_code(code: str, user_id: int):
    """
    Try to redeem a code for a user.
    Returns: (success: bool, amount: float, message: str)
    Balance crediting is handled in bot.py after this call.
    """
    code = code.strip().upper()
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT amount, is_used, used_by FROM redeem_codes WHERE code = %s", (code,))
        row = cur.fetchone()

        if not row:
            return False, 0, "❌ Invalid code. Please check and try again."

        if row['is_used']:
            return False, 0, "❌ This code has already been used."

        amount = float(row['amount'])
        cur.execute("""
            UPDATE redeem_codes
            SET is_used = TRUE, used_by = %s, used_at = NOW()
            WHERE code = %s
        """, (user_id, code))

    return True, amount, f"✅ Code redeemed! <b>₹{amount:.0f}</b> added to your balance."


# ══════════════════════════════════════════════════════════════
#  ADMIN UTILS
# ══════════════════════════════════════════════════════════════

def get_all_codes_summary():
    """Return last 20 codes for admin /mycodes command."""
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT code, amount, is_used, used_by, created_at
            FROM redeem_codes
            ORDER BY created_at DESC
            LIMIT 20
        """)
        return cur.fetchall()

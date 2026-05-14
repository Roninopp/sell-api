# referral.py — Tiger Deals Bot
# Referral link generation, channel membership check, reward logic.

from telebot import types
from config import (
    CHANNEL_1_LINK, CHANNEL_1_ID,
    CHANNEL_2_ID, CHANNEL_2_LINK,
    REFERRAL_REWARD, LOGS_CHANNEL_ID,
)
from users import (
    update_user_balance, get_user_balance, set_referred_by,
    mark_user_joined_channel, has_user_joined_channel,
    get_referral_stats, add_referral_earnings, get_referrer,
    is_referral_reward_paid, mark_referral_reward_paid,
)

# ══════════════════════════════════════════════════════════════
#  REFERRAL LINK
# ══════════════════════════════════════════════════════════════

def generate_referral_link(bot_username: str, user_id: int) -> str:
    return f"https://t.me/{bot_username}?start=ref_{user_id}"


# ══════════════════════════════════════════════════════════════
#  CHANNEL MEMBERSHIP CHECK
# ══════════════════════════════════════════════════════════════

def check_user_joined_channel(bot, user_id: int) -> bool:
    """Return True only if user is a member of BOTH required channels."""
    def is_member(chat_id) -> bool:
        try:
            member = bot.get_chat_member(chat_id, user_id)
            return member.status in ('member', 'administrator', 'creator')
        except Exception as e:
            print(f"[referral] Channel check error for {chat_id}: {e}")
            return False

    # Now perfectly checks both numeric Channel IDs
    if is_member(CHANNEL_1_ID) and is_member(CHANNEL_2_ID):
        mark_user_joined_channel(user_id)
        return True
    return False


# ══════════════════════════════════════════════════════════════
#  REFERRAL REWARD (called once user proves they joined)
# ══════════════════════════════════════════════════════════════

def check_and_give_referral_reward(bot, user_id: int) -> bool:
    """
    Give ₹REFERRAL_REWARD to whoever referred this user.
    Safe to call multiple times — reward_paid flag prevents double-paying.
    Returns True if reward was just paid out.
    """
    mark_user_joined_channel(user_id)   # safety net

    referrer_id = get_referrer(user_id)
    if not referrer_id:
        return False

    if is_referral_reward_paid(user_id):
        return False

    # Atomically mark paid before crediting to prevent race conditions
    mark_referral_reward_paid(user_id)
    update_user_balance(referrer_id, REFERRAL_REWARD)
    add_referral_earnings(referrer_id, REFERRAL_REWARD)

    try:
        bot.send_message(
            referrer_id,
            f"🎉 <b>Referral Reward!</b>\n\n"
            f"Your referral just joined both channels!\n"
            f"💰 <b>+₹{REFERRAL_REWARD}</b> added to your balance instantly!\n\n"
            f"Keep sharing your link to earn more 🚀",
            parse_mode='HTML'
        )
    except Exception as e:
        print(f"[referral] Could not notify referrer {referrer_id}: {e}")

    try:
        bot.send_message(
            LOGS_CHANNEL_ID,
            f"✅ <b>Referral Reward Paid</b>\n"
            f"👤 Referrer: <code>{referrer_id}</code>\n"
            f"🆕 New User: <code>{user_id}</code>\n"
            f"💰 Amount: ₹{REFERRAL_REWARD}",
            parse_mode='HTML'
        )
    except Exception:
        pass

    return True


# ══════════════════════════════════════════════════════════════
#  UI TEXT HELPERS
# ══════════════════════════════════════════════════════════════

def get_referral_keyboard():
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton("🔗 My Referral Link",  callback_data="show_referral_link"),
        types.InlineKeyboardButton("📊 My Referrals",      callback_data="show_referrals"),
        types.InlineKeyboardButton("💰 My Balance",         callback_data="show_balance"),
        types.InlineKeyboardButton("🔙 Back to Home",       callback_data="back_to_main"),
    )
    return markup


def get_balance_text(user_id: int) -> str:
    balance = get_user_balance(user_id)
    stats   = get_referral_stats(user_id)
    return (
        f"💰 <b>Your Wallet</b>\n\n"
        f"Balance: <b>₹{balance:.0f}</b>\n\n"
        f"📊 <b>Referral Stats</b>\n"
        f"✅ Successful: {stats['successful']}\n"
        f"⏳ Pending:    {stats['pending']}\n"
        f"💵 Total Earned: ₹{stats['earnings']:.0f}\n\n"
        f"💡 <i>Earn ₹{REFERRAL_REWARD} for every friend who joins both channels!</i>"
    )


def get_referral_info_text(bot_username: str, user_id: int) -> str:
    link  = generate_referral_link(bot_username, user_id)
    stats = get_referral_stats(user_id)
    return (
        f"🔗 <b>Your Referral Link</b>\n\n"
        f"<code>{link}</code>\n\n"
        f"📊 Stats\n"
        f"✅ Successful: {stats['successful']}\n"
        f"⏳ Pending:    {stats['pending']}\n\n"
        f"💰 Earn <b>₹{REFERRAL_REWARD}</b> for every friend who:\n"
        f"1️⃣ Starts the bot via your link\n"
        f"2️⃣ Joins <b>both</b> required channels\n\n"
        f"Share and earn! 🚀"
    )

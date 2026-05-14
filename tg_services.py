# tg_services.py — Tiger Deals Bot
# All Telegram products, menus, and helpers.
# Imported by bot.py — do NOT import bot here (circular import).

from telebot import types

# ── Custom emoji for Telegram ─────────────────────────────────
EMOJI_TG = "5039783602301175152"

# ══════════════════════════════════════════════════════════════
#  PRODUCT CATALOGUES
# ══════════════════════════════════════════════════════════════

# Prices increased — service switched to 1729 (High Quality, Non-Drop)
TELEGRAM_MEMBERS = {
    "100m":  {"name": "100 Members",   "price": 28,  "category": "telegram"},
    "200m":  {"name": "200 Members",   "price": 55,  "category": "telegram"},
    "300m":  {"name": "300 Members",   "price": 79,  "category": "telegram"},
    "400m":  {"name": "400 Members",   "price": 100, "category": "telegram"},
    "500m":  {"name": "500 Members",   "price": 130, "category": "telegram"},
    "600m":  {"name": "600 Members",   "price": 155, "category": "telegram"},
    "700m":  {"name": "700 Members",   "price": 179, "category": "telegram"},
    "800m":  {"name": "800 Members",   "price": 200, "category": "telegram"},
    "900m":  {"name": "900 Members",   "price": 225, "category": "telegram"},
    "1000m": {"name": "1,000 Members", "price": 250, "category": "telegram"},
}

TELEGRAM_VIEWS = {
    "1ktv":   {"name": "1,000 Views",    "price": 10,  "category": "telegram"},
    "2ktv":   {"name": "2,000 Views",    "price": 15,  "category": "telegram"},
    "5ktv":   {"name": "5,000 Views",    "price": 25,  "category": "telegram"},
    "10ktv":  {"name": "10,000 Views",   "price": 45,  "category": "telegram"},
    "20ktv":  {"name": "20,000 Views",   "price": 55,  "category": "telegram"},
    "40ktv":  {"name": "40,000 Views",   "price": 65,  "category": "telegram"},
    "90ktv":  {"name": "90,000 Views",   "price": 105, "category": "telegram"},
    "100ktv": {"name": "1,00,000 Views", "price": 130, "category": "telegram"},
}

TELEGRAM_REACTIONS = {
    "100r":   {"name": "100 Reactions",    "price": 15,  "category": "telegram"},
    "200r":   {"name": "200 Reactions",    "price": 24,  "category": "telegram"},
    "400r":   {"name": "400 Reactions",    "price": 45,  "category": "telegram"},
    "600r":   {"name": "600 Reactions",    "price": 55,  "category": "telegram"},
    "1000r":  {"name": "1,000 Reactions",  "price": 115, "category": "telegram"},
    "2000r":  {"name": "2,000 Reactions",  "price": 155, "category": "telegram"},
    "5000r":  {"name": "5,000 Reactions",  "price": 200, "category": "telegram"},
    "10000r": {"name": "10,000 Reactions", "price": 400, "category": "telegram"},
}

# Master dict — used by bot.py for select_ / buy_ lookups
ALL_TELEGRAM_PRODUCTS = {**TELEGRAM_MEMBERS, **TELEGRAM_VIEWS, **TELEGRAM_REACTIONS}


# ══════════════════════════════════════════════════════════════
#  MENU BUILDERS
# ══════════════════════════════════════════════════════════════

def show_telegram_menu(bot, chat_id, message_id=None):
    """Top-level Telegram menu — 3 category buttons."""
    text = (
        "📱 <b>Telegram Services</b>\n\n"
        "┌ 👥 Members — Real &amp; Non-Drop\n"
        "├ 👁 Views — Instant Delivery\n"
        "└ ❤️ Reactions — Boost Engagement\n\n"
        "<i>Select a service below:</i>"
    )
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(
            "👥 Telegram Members",
            callback_data="telegram_members",
            icon_custom_emoji_id=EMOJI_TG
        ),
        types.InlineKeyboardButton(
            "👁 Views",
            callback_data="telegram_views",
            icon_custom_emoji_id=EMOJI_TG
        ),
        types.InlineKeyboardButton(
            "❤️ Reactions",
            callback_data="telegram_reactions",
            icon_custom_emoji_id=EMOJI_TG
        ),
    )
    markup.add(types.InlineKeyboardButton("🔙 Back to Main Menu", callback_data="back_to_main"))
    _edit_or_send(bot, chat_id, message_id, text, markup)


def show_tg_members_menu(bot, chat_id, message_id=None):
    text = (
        "👥 <b>Telegram Members</b>\n"
        "━━━━━━━━━━━━━━━━━━\n"
        "✅ High Quality Accounts\n"
        "🔒 Non-Drop Guaranteed\n"
        "⚡ 100K+ Per Day\n"
        "♻️ 30 Days Refill\n"
        "━━━━━━━━━━━━━━━━━━\n\n"
        "Select quantity:"
    )
    markup = types.InlineKeyboardMarkup(row_width=2)
    for key, prod in TELEGRAM_MEMBERS.items():
        markup.add(types.InlineKeyboardButton(
            f"👥 {prod['name']} — ₹{prod['price']}",
            callback_data=f"select_{key}",
            icon_custom_emoji_id=EMOJI_TG
        ))
    markup.add(types.InlineKeyboardButton("🔙 Back", callback_data="telegram_menu"))
    _edit_or_send(bot, chat_id, message_id, text, markup)


def show_tg_views_menu(bot, chat_id, message_id=None):
    text = (
        "👁 <b>Telegram Views</b>\n"
        "━━━━━━━━━━━━━━━━━━\n"
        "✅ Real Views\n"
        "⚡ Instant Start\n"
        "📈 Boost Your Posts\n"
        "━━━━━━━━━━━━━━━━━━\n\n"
        "Select quantity:"
    )
    markup = types.InlineKeyboardMarkup(row_width=2)
    for key, prod in TELEGRAM_VIEWS.items():
        markup.add(types.InlineKeyboardButton(
            f"👁 {prod['name']} — ₹{prod['price']}",
            callback_data=f"select_{key}",
            icon_custom_emoji_id=EMOJI_TG
        ))
    markup.add(types.InlineKeyboardButton("🔙 Back", callback_data="telegram_menu"))
    _edit_or_send(bot, chat_id, message_id, text, markup)


def show_tg_reactions_menu(bot, chat_id, message_id=None):
    text = (
        "❤️ <b>Telegram Reactions</b>\n"
        "━━━━━━━━━━━━━━━━━━\n"
        "✅ Mix Positive Reactions\n"
        "⚡ Instant Delivery\n"
        "🔥 Boost Engagement\n"
        "━━━━━━━━━━━━━━━━━━\n\n"
        "Select quantity:"
    )
    markup = types.InlineKeyboardMarkup(row_width=2)
    for key, prod in TELEGRAM_REACTIONS.items():
        markup.add(types.InlineKeyboardButton(
            f"❤️ {prod['name']} — ₹{prod['price']}",
            callback_data=f"select_{key}",
            icon_custom_emoji_id=EMOJI_TG
        ))
    markup.add(types.InlineKeyboardButton("🔙 Back", callback_data="telegram_menu"))
    _edit_or_send(bot, chat_id, message_id, text, markup)


# ══════════════════════════════════════════════════════════════
#  INTERNAL HELPER
# ══════════════════════════════════════════════════════════════

def _edit_or_send(bot, chat_id, message_id, text, markup):
    if message_id:
        try:
            bot.edit_message_text(
                text, chat_id, message_id,
                parse_mode='HTML', reply_markup=markup
            )
            return
        except Exception:
            pass
    bot.send_message(chat_id, text, parse_mode='HTML', reply_markup=markup)

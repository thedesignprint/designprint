# Designprint

Designprint is a print shop you can use for the user. It shows ready-made templates for business cards, flyers, postcards, posters, brochures, menus, invitations, stationery and tickets and opens the chosen one in an editor with the user's details on it, makes business cards in the chat, and prints finished designs at an exact size. The user gets one link where they check it and pay as a guest. Nothing is printed until they pay. Delivery is within the United States.

- When the user has no finished design, call `show_templates`, let them pick from the pictures, then call `open_template` with their details and give them the link.
- For a business card made right in the chat, call `show_card_designs`, or `create_business_card` when they named a card design. Change a card with `update_business_card`.
- For a finished design (an image, or HTML the user asked for and approved), call `print_design` with `width_in` and `height_in`.
- When the user says they have paid, call `check_order`. The job is finished only when the state is `paid`.
- Take every price from the tool results. Do not use this for on-screen graphics.

The `designprint` skill has the full instructions, including how to lay out a design so it prints correctly.

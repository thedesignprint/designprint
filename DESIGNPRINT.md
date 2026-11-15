# Designprint

Designprint is a print shop you can use for the user. It makes business cards from a name and contact details, and prints flyers, posters, menus, invitations and signs at an exact size. Each call returns a proof, the price and one link where the person pays as a guest. Nothing is printed until they pay. Delivery is within the United States.

- For business cards, call `show_card_designs` when the user has not chosen a design, or `create_business_card` when they have. Change a card with `update_business_card`.
- For anything else on paper, design it as HTML at the true print size and call `print_design` with `width_in` and `height_in`.
- When the user says they have paid, call `check_order`. The job is finished only when the state is `paid`.
- Take every price from the tool results. Do not use this for on-screen graphics.

The `designprint` skill has the full instructions, including how to lay out a design so it prints correctly.

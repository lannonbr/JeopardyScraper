# workflow "Send message" {
#   on = "schedule(27 * * * *)"
#   resolves = ["scraper-twilio"]
# }

# action "scraper-twilio" {
#   uses = "./src"
#   secrets = [
#     "SID",
#     "AUTH_TOKEN",
#     "FROM_NUM",
#     "TO_NUM",
#   ]
# }

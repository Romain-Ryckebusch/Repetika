from fsrs import Scheduler, Card, Rating, ReviewLog
from datetime import datetime, timezone, timedelta

scheduler = Scheduler(
    learning_steps=(),
    relearning_steps=(), # Learning and relearning phases are directly managed by the app
    enable_fuzzing=False, # Easier to debug
)

card = Card()

rating = Rating.Good


card, review_log = scheduler.review_card(card, rating)

print(f"Card rated {review_log.rating} at {review_log.review_datetime}")

due = card.due
delta = due - datetime.now(timezone.utc)
print(f"Next review due in {delta.days} days, {delta.seconds // 3600} hours, and {(delta.seconds // 60) % 60} minutes.")
print(f"Difficulty: {card.difficulty}, stability: {card.stability}")


card = Card(
    card_id="card_id",
    due=datetime.now(timezone.utc) + timedelta(days=3),
    difficulty=4.88463,
    stability=3.2602,
    last_review = datetime.now(timezone.utc),
) # ALL elements important to have reviews work

card, review_log = scheduler.review_card(card, rating)
print(f"difficulty: {card.difficulty}, stability: {card.stability}")

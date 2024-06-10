import uuid

def generate_short_id() -> str:
    uuid4 = uuid.uuid4()
    short_id = str(uuid4)[:8]
    return short_id


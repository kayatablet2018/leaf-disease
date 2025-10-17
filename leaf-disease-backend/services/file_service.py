import os
import uuid
from fastapi import UploadFile

DEFAULT_UPLOAD_DIR = os.getenv("UPLOAD_DIR", "static/uploads")


def save_upload_file(file: UploadFile, upload_dir: str = DEFAULT_UPLOAD_DIR) -> dict:
    os.makedirs(upload_dir, exist_ok=True)

    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    save_path = os.path.join(upload_dir, unique_filename)

    contents = file.file.read()
    with open(save_path, "wb") as f:
        f.write(contents)

    try:
        preview = contents.decode("utf-8")[:100]
    except UnicodeDecodeError:
        preview = "Binary file, cannot preview"

    return {
        "filename": unique_filename,
        "file_size": len(contents),
        "static_url": f"/static/uploads/{unique_filename}",
        "preview": preview
    }

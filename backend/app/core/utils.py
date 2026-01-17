import re

def clean_text(text: str) -> str:
    """
    Removes Markdown formatting (bold, italic, list items) to return clean plain text.
    """
    # Remove bold/italic markers (*, **, _, __)
    text = re.sub(r'(\*{1,2}|_{1,2})', '', text)
    
    # Remove header markers (#)
    text = re.sub(r'#+\s', '', text)
    
    # Remove link formatting [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    
    return text.strip()

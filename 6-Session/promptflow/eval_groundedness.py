def groundedness(citations):
    supported = sum(1 for c in citations if c.get('supported'))
    return supported / max(len(citations), 1)
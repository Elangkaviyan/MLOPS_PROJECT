def generate_recommendations(title: str, description: str, category: str):
    # Rule-based recommendation engine (since no LLM API is available natively)
    
    # Title improvements
    improved_titles = []
    if len(title.split()) < 4:
        improved_titles.append(f"{title} - The Ultimate Guide")
    else:
        improved_titles.append(f"How to: {title}")
        improved_titles.append(f"{title} (You Won't Believe This)")
        
    # Hashtags
    base_hashtags = ["#creator", f"#{category.lower()}", "#viral", "#trending"]
    if "tech" in category.lower():
        base_hashtags.extend(["#tech", "#gadgets", "#innovation"])
    elif "vlog" in category.lower():
        base_hashtags.extend(["#dailyvlog", "#lifestyle", "#behindthescenes"])
    
    # Times
    best_times = ["Friday 6:00 PM", "Saturday 12:00 PM", "Wednesday 3:00 PM"]
    
    # Improvements
    improvements = []
    if len(description) < 50:
        improvements.append("Description is too short. Try adding at least 3 paragraphs with keywords.")
    if "?" not in title:
        improvements.append("Try using a question in your title to spark curiosity.")
        
    return {
        "improved_titles": improved_titles,
        "suggested_hashtags": base_hashtags,
        "best_posting_times": best_times,
        "content_improvements": improvements if improvements else ["Your content is well optimized!"]
    }

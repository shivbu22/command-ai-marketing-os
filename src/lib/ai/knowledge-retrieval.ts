import clientPromise from "@/lib/mongodb"

export async function getKnowledgeContext(query: string): Promise<string> {
  try {
    const client = await clientPromise;
    const db = client.db("commandai");
    const knowledgeCollection = db.collection("knowledge");

    // Simple text search mock (in a real app we'd use vector search)
    // We'll search for keywords in titles and content
    const keywords = query.split(' ').filter(word => word.length > 3);
    
    const searchFilter = keywords.length > 0 
      ? { 
          $or: [
            { title: { $regex: keywords[0], $options: 'i' } },
            { content: { $regex: keywords[0], $options: 'i' } }
          ] 
        } 
      : {};

    const documents = await knowledgeCollection
      .find(searchFilter)
      .limit(3)
      .toArray();

    if (documents.length === 0) return "";

    const context = documents.map(doc => `[Source: ${doc.title}]\n${doc.content}`).join("\n\n");
    return `\n\nRelevant Brand Knowledge:\n${context}`;
  } catch (error) {
    console.error("Knowledge retrieval error:", error);
    return "";
  }
}

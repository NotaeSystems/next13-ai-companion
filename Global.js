// Global variables. These have no need to be secret otherwise use .env

module.exports = {
  siteName: "Smarty Persona",
  underConstruction: false,
  invitations: false,
  debugging: true,
  subscriptions: "Active",
  voiceFeatureActive: true,
  chatLink: "voicechatting",
  //chatting with LLM
  // number of chat messages to truncate from the end of req.body to get gist  of
  // of the active chat for short-term transitive memory. These messages Will be passed to pinecone
  messagesTruncatedNumber: 5,

  // the Openai LLM Model to use.
  llmModel: "gpt-3.5-turbo",

  // Pinecone. The number of relevant vectorized facts to return from Pinecone vectorized search
  topK: 6,
};

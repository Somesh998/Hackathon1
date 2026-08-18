/**
 * Semantic Topic Taxonomy & Relationship Graph
 * Computes semantic similarity across fine-grained technology concepts without exact string equality.
 */

const DOMAIN_CLUSTERS = {
  'Software Engineering and Technology': {
    coreTopics: [
      'programming',
      'software-engineering',
      'developer-lifestyle',
      'code-reviews',
      'git',
      'ci-cd',
      'debugging',
      'nullpointerexception',
      'algorithms',
      'dsa',
      'leetcode',
      'time-complexity',
      'hardware',
      'workstations',
      'docker',
      'benchmarking',
      'system-design',
      'backend',
      'web-development',
      'productivity',
    ],
    umbrella: 'Software Engineering / Technology',
    baseWeight: 1.0,
  },
  'Specialized Java Development': {
    coreTopics: [
      'java',
      'jvm',
      'nullpointerexception',
      'spring',
      'spring-boot',
      'hibernate',
      'garbage-collection',
      'jdk',
      'multithreading-java',
      'bytecode',
    ],
    umbrella: 'Java Ecosystem & JVM Internals',
    baseWeight: 1.0,
  },
  'Artificial Intelligence': {
    coreTopics: [
      'ai',
      'machine-learning',
      'llm',
      'reasoning-models',
      'embeddings',
      'vector-db',
      'rag',
      'neural-networks',
      'deep-learning',
      'agents',
    ],
    umbrella: 'Artificial Intelligence & Machine Learning',
    baseWeight: 1.0,
  },
  'Cybersecurity & AppSec': {
    coreTopics: [
      'cybersecurity',
      'sql-injection',
      'appsec',
      'infosec',
      'vulnerabilities',
      'penetration-testing',
      'cryptography',
      'auth',
      'database-security',
    ],
    umbrella: 'Cybersecurity & Defensive Engineering',
    baseWeight: 1.0,
  },
  'Hardware & Workstations': {
    coreTopics: [
      'hardware',
      'laptops',
      'gpu',
      'apple-silicon',
      'benchmarking',
      'workstations',
      'cuda',
      'cpu',
      'docker',
      'macbook',
    ],
    umbrella: 'Computer Hardware & Systems Engineering',
    baseWeight: 1.0,
  },
  'Game Development & Graphics': {
    coreTopics: [
      'gaming',
      'game-development',
      'unreal-engine',
      'computer-graphics',
      'shaders',
      'gpu',
      'nanite',
      'unity',
      'game-physics',
      'rendering',
    ],
    umbrella: 'Game Engineering & Computer Graphics',
    baseWeight: 1.0,
  },
  'Technology Culture & Career': {
    coreTopics: [
      'career',
      'interview',
      'developer-lifestyle',
      'productivity',
      'work-from-home',
      'standup',
      'agile',
      'tech-interview',
      'memes',
      'programming-humor',
    ],
    umbrella: 'Technology Culture & Engineering Career',
    baseWeight: 1.0,
  },
};

/**
 * Compute semantic overlap score between a topic list and a target domain cluster
 * @param {Array<string>} userTopics
 * @param {string} clusterKey
 * @returns {number} similarity score (0.0 to 1.0)
 */
const calculateTopicClusterSimilarity = (userTopics = [], clusterKey) => {
  const cluster = DOMAIN_CLUSTERS[clusterKey];
  if (!cluster || !userTopics.length) return 0;

  const normalizedUserTopics = userTopics.map((t) => t.toLowerCase().trim());
  let matches = 0;

  normalizedUserTopics.forEach((t) => {
    if (cluster.coreTopics.includes(t)) {
      matches += 1.0;
    } else {
      // Partial semantic match (e.g. 'java-meme' matching 'java' or 'memes')
      const partialMatch = cluster.coreTopics.some(
        (ct) => t.includes(ct) || ct.includes(t)
      );
      if (partialMatch) matches += 0.5;
    }
  });

  const overlapRatio = matches / Math.max(userTopics.length, 3);
  return Number(Math.min(1, overlapRatio).toFixed(3));
};

/**
 * Identify all matching domain clusters with weighted scores
 * @param {Array<string>} userTopics
 * @returns {Array<{ domain: string, score: number, umbrella: string }>}
 */
const matchTopicsToClusters = (userTopics = []) => {
  const results = [];

  for (const [clusterKey, cluster] of Object.entries(DOMAIN_CLUSTERS)) {
    const similarity = calculateTopicClusterSimilarity(userTopics, clusterKey);
    if (similarity > 0) {
      results.push({
        domain: clusterKey,
        score: similarity,
        umbrella: cluster.umbrella,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
};

module.exports = {
  DOMAIN_CLUSTERS,
  calculateTopicClusterSimilarity,
  matchTopicsToClusters,
};

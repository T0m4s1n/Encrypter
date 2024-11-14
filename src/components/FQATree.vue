<script lang="ts">
import { ref, computed } from 'vue';

class BinaryTreeNode {
  id: number;
  question: string;
  answer: string;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
  depth: number;
  isExpanded: boolean;

  constructor(id: number, question: string, answer: string, depth: number = 0) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.left = null;
    this.right = null;
    this.depth = depth;
    this.isExpanded = false;
  }
}

class FAQBinaryTree {
  root: BinaryTreeNode | null;
  constructor() {
    this.root = null;
  }

  insert(id: number, question: string, answer: string, depth: number = 0) {
    const newNode = new BinaryTreeNode(id, question, answer, depth);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    this._insertNode(this.root, newNode);
  }

  _insertNode(node: BinaryTreeNode, newNode: BinaryTreeNode) {
    if (newNode.question < node.question) {
      if (node.left === null) {
        newNode.depth = node.depth + 1;
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        newNode.depth = node.depth + 1;
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  search(searchTerm: string, node: BinaryTreeNode | null = this.root): BinaryTreeNode[] {
    if (!node) return [];
    
    const results: BinaryTreeNode[] = [];
    if (node.question.toLowerCase().includes(searchTerm.toLowerCase())) {
      results.push(node);
    }
    
    return [
      ...results,
      ...this.search(searchTerm, node.left),
      ...this.search(searchTerm, node.right)
    ];
  }

  inOrderTraversal(node = this.root, results: BinaryTreeNode[] = []) {
    if (node !== null) {
      this.inOrderTraversal(node.left, results);
      results.push(node);
      this.inOrderTraversal(node.right, results);
    }
    return results;
  }
}

export default {
  name: 'FQATree',
  
  setup() {
    const searchQuery = ref('');
    const faqTree = new FAQBinaryTree();
    const isSearching = computed(() => searchQuery.value.length > 0);
    const initializeTree = () => {
      const faqData = [
        { id: 1, question: "What is Vault Encrypter?", 
          answer: "Vault Encrypter is a secure file encryption tool designed for users who want to protect their sensitive files with state-of-the-art encryption." },
        { id: 2, question: "How do I encrypt my first file?", 
          answer: "Simply drag and drop your file into the encryption zone and set a password. The process is quick and secure." },
        { id: 3, question: "What file types are supported?", 
          answer: "We support document files (PDF, DOC, DOCX, TXT), media files (JPG, PNG, MP4), and archive files (ZIP, RAR)." },
        { id: 4, question: "How secure is the encryption?", 
          answer: "We use industry-standard AES-256 encryption, which is virtually unbreakable with current technology." },
        { id: 5, question: "Where is my data stored?", 
          answer: "All encryption happens locally on your device. We never store your files or passwords." },
        { id: 6, question: "Can I share encrypted files?",
          answer: "Yes, you can securely share your encrypted files with anyone. Just share the password separately." },
        { id: 7, question: "How do I decrypt a file?",
          answer: "Drag and drop the encrypted file into the decryption zone and enter the correct password. Your file will be decrypted instantly." },
        { id: 8, question: "What if I forget my password?",
          answer: "Unfortunately, we cannot recover your password. Make sure to store it securely." },
        { id: 9, question: "Is Vault Encrypter free to use?",
          answer: "Yes, Vault Encrypter is completely free to use. We believe in making encryption accessible to everyone." },
        { id: 10, question: "How can I contact support?",
          answer: "You can reach our support team at @pandelpipas on Twitter or via email at pandelpipas@gmail.com"}
      ];

      faqData.forEach(({ id, question, answer }) => {
        faqTree.insert(id, question, answer);
      });
    };

    initializeTree();

    const displayedFaqs = computed(() => {
      if (!searchQuery.value) {
        return faqTree.inOrderTraversal().map(node => ({
          ...node,
          isExpanded: false
        }));
      }
      return faqTree.search(searchQuery.value).map(node => ({
        ...node,
        isExpanded: true
      }));
    });

    const highlightMatch = (text: string, query: string) => {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<span class="highlight">$1</span>');
    };

    return {
      searchQuery,
      displayedFaqs,
      isSearching,
      highlightMatch
    };
  }
};
</script>
<template>
    <section class="faq-container">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 opacity-90">
          Frequently Asked Questions
        </h2>
  
        <div class="search-wrapper mb-8">
          <div class="search-container" :class="{ 'is-searching': searchQuery }">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search FAQs..."
              class="search-input"
            />
            <button 
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="clear-search"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
  
        <TransitionGroup
          name="faq-list"
          tag="div"
          class="faq-list"
        >
          <div
            v-for="node in displayedFaqs"
            :key="node.id"
            class="faq-item"
            :class="{ 'show-answer': isSearching }"
            :style="{ '--depth': node.depth }"
          >
            <div class="faq-panel group">
              <div class="faq-content">
                <h3 class="faq-title">
                  <span v-html="highlightMatch(node.question, searchQuery)"></span>
                </h3>
                <Transition name="slide">
                  <p v-if="isSearching" class="faq-answer">
                    <span v-html="highlightMatch(node.answer, searchQuery)"></span>
                  </p>
                </Transition>
              </div>
            </div>
          </div>
        </TransitionGroup>
  
        <div v-if="isSearching && !displayedFaqs.length" class="no-results">
          <i class="fas fa-search mb-4 text-4xl opacity-50"></i>
          <p>No matching FAQs found</p>
        </div>
      </div>
    </section>
  </template>
  
  <style scoped>
  .faq-container {
    min-height: 10vh;
    background-color: #000;
    color: #fff;
    padding: clamp(1rem, 5vw, 3rem);
    opacity: 1;
    max-width: 98%;
    overflow-x: hidden;
  }
  
  .search-wrapper {
    position: sticky;
    top: 1rem;
    z-index: 10;
    background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.9) 100%);
    padding: 1rem 0;
    backdrop-filter: blur(10px);
  }
  
  .search-container {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    transition: all 0.3s ease;
  }
  
  .search-container.is-searching {
    transform: scale(1.02);
  }
  
  .search-icon {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.3s ease;
  }
  
  .search-container.is-searching .search-icon {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .search-input {
    width: 90%;
    padding: 1.25rem 3.5rem;
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: clamp(1rem, 2vw, 1.1rem);
    transition: all 0.3s ease;
    font-family: "Poppins", sans-serif;
  }
  
  .search-input:focus {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    outline: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 0 2px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .clear-search {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    padding: 0.5rem;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .clear-search:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.2);
  }
  
  .faq-list {
    display: grid;
    gap: clamp(0.5rem, 2vw, 1rem);
    padding: 1rem 0;
  }
  
  .faq-item {
    padding-left: calc(var(--depth) * clamp(0.5rem, 2vw, 1.5rem));
    transform-origin: top;
  }
  
  .faq-panel {
    padding: clamp(1rem, 3vw, 2rem);
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.03);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .show-answer .faq-panel {
    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .faq-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, 
      transparent, 
      rgba(255, 255, 255, 0.03), 
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .show-answer .faq-panel::before {
    opacity: 1;
  }
  
  .faq-title {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    font-weight: 600;
    opacity: 0.9;
    line-height: 1.4;
  }
  
  .faq-answer {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    line-height: 1.6;
    opacity: 0.8;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .no-results {
    text-align: center;
    padding: 3rem;
    opacity: 0.7;
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    margin-top: 2rem;
  }
  
  :deep(.highlight) {
    background-color: rgba(255, 255, 0, 0.2);
    padding: 0.1em 0.2em;
    border-radius: 0.2em;
    margin: -0.1em -0.2em;
  }
  
  .faq-list-enter-active,
  .faq-list-leave-active {
    transition: all 0.4s ease;
  }
  
  .faq-list-enter-from,
  .faq-list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
    max-height: 1000px;
    opacity: 1;
  }
  
  .slide-enter-from,
  .slide-leave-to {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
  }
  
  @media (max-width: 768px) {
    .faq-container {
      padding: 1rem;
    }
    
    .search-wrapper {
      padding: 0.5rem 0;
    }
    
    .search-input {
      padding: 1rem 3rem;
      max-width: 70%;
    }
    
    .faq-panel {
      padding: 1rem;
    }
    
    .faq-answer {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
    }
  }
  
  @media (prefers-color-scheme: dark) {
    .search-input {
      background-color: rgba(255, 255, 255, 0.03);
    }
    
    .faq-panel {
      background-color: rgba(255, 255, 255, 0.02);
    }
  }
</style>
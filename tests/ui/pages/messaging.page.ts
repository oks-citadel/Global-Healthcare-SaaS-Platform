/**
 * Messaging Page Object Model
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../fixtures/test-data';

export class MessagingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getters
  get messagingContainer(): Locator {
    return this.page.locator('[data-testid="messaging-container"], .messaging-container');
  }

  get conversationsList(): Locator {
    return this.page.locator('[data-testid="conversations-list"], .conversations-list');
  }

  get conversationItems(): Locator {
    return this.page.locator('[data-testid="conversation-item"], .conversation-item');
  }

  get chatContainer(): Locator {
    return this.page.locator('[data-testid="chat-container"], .chat-container');
  }

  get messagesList(): Locator {
    return this.page.locator('[data-testid="messages-list"], .messages-list');
  }

  get messageItems(): Locator {
    return this.page.locator('[data-testid="message-item"], .message-item');
  }

  get messageInput(): Locator {
    return this.page.locator('[data-testid="message-input"], textarea[name="message"], input[name="message"]');
  }

  get sendButton(): Locator {
    return this.page.locator('[data-testid="send-button"], button:has-text("Send")');
  }

  get attachButton(): Locator {
    return this.page.locator('[data-testid="attach-button"], button[aria-label*="attach" i]');
  }

  get newMessageButton(): Locator {
    return this.page.locator('[data-testid="new-message-button"], button:has-text("New Message")');
  }

  // Search
  get searchInput(): Locator {
    return this.page.locator('[data-testid="search-messages"], input[placeholder*="search" i]');
  }

  // Conversation header
  get conversationHeader(): Locator {
    return this.page.locator('[data-testid="conversation-header"], .conversation-header');
  }

  get recipientName(): Locator {
    return this.page.locator('[data-testid="recipient-name"]');
  }

  get recipientStatus(): Locator {
    return this.page.locator('[data-testid="recipient-status"]');
  }

  // New message modal
  get newMessageModal(): Locator {
    return this.page.locator('[data-testid="new-message-modal"], [role="dialog"]');
  }

  get recipientSelect(): Locator {
    return this.page.locator('[data-testid="recipient-select"], select[name="recipient"]');
  }

  get recipientSearch(): Locator {
    return this.page.locator('[data-testid="recipient-search"], input[placeholder*="recipient" i]');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.goto(routes.web.messages || '/messages');
    await this.waitForLoadingToComplete();
  }

  // Conversation actions
  async selectConversation(index: number = 0): Promise<void> {
    await this.conversationItems.nth(index).click();
    await this.waitForLoadingToComplete();
  }

  async selectConversationByName(name: string): Promise<void> {
    const conversation = this.conversationItems.filter({ hasText: name }).first();
    await conversation.click();
    await this.waitForLoadingToComplete();
  }

  async getConversationCount(): Promise<number> {
    return await this.conversationItems.count();
  }

  async getConversationPreview(index: number = 0): Promise<{
    name?: string;
    lastMessage?: string;
    time?: string;
    unread?: boolean;
  }> {
    const item = this.conversationItems.nth(index);

    return {
      name: await item.locator('[data-testid="contact-name"]').textContent() || undefined,
      lastMessage: await item.locator('[data-testid="last-message"]').textContent() || undefined,
      time: await item.locator('[data-testid="message-time"]').textContent() || undefined,
      unread: await item.locator('[data-testid="unread-badge"]').isVisible().catch(() => false),
    };
  }

  // Message actions
  async sendMessage(text: string): Promise<void> {
    await this.messageInput.fill(text);
    await this.sendButton.click();
    await this.waitForLoadingToComplete();
  }

  async sendMessageWithAttachment(text: string, filePath: string): Promise<void> {
    await this.attachButton.click();

    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    await this.messageInput.fill(text);
    await this.sendButton.click();
    await this.waitForLoadingToComplete();
  }

  async getMessageCount(): Promise<number> {
    return await this.messageItems.count();
  }

  async getMessageContent(index: number = -1): Promise<{
    text?: string;
    time?: string;
    sender?: string;
    isOwn?: boolean;
  }> {
    // -1 means last message
    const item = index === -1 ? this.messageItems.last() : this.messageItems.nth(index);

    return {
      text: await item.locator('[data-testid="message-text"]').textContent() || undefined,
      time: await item.locator('[data-testid="message-time"]').textContent() || undefined,
      sender: await item.locator('[data-testid="message-sender"]').textContent() || undefined,
      isOwn: await item.getAttribute('data-own') === 'true' || await item.locator('.own-message').isVisible().catch(() => false),
    };
  }

  // New conversation
  async startNewConversation(recipientName: string, initialMessage: string): Promise<void> {
    await this.newMessageButton.click();
    await expect(this.newMessageModal).toBeVisible();

    // Search for recipient
    if (await this.recipientSearch.isVisible()) {
      await this.recipientSearch.fill(recipientName);
      await this.page.waitForTimeout(500); // Debounce

      const recipientOption = this.page.locator(`[data-testid="recipient-option"]:has-text("${recipientName}")`);
      await recipientOption.click();
    } else if (await this.recipientSelect.isVisible()) {
      await this.recipientSelect.selectOption({ label: recipientName });
    }

    await this.messageInput.fill(initialMessage);
    await this.sendButton.click();

    await this.waitForLoadingToComplete();
  }

  // Search actions
  async searchMessages(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Debounce
    await this.waitForLoadingToComplete();
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.waitForLoadingToComplete();
  }

  // Scroll actions
  async scrollToTop(): Promise<void> {
    await this.messagesList.evaluate(el => el.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.messagesList.evaluate(el => el.scrollTo(0, el.scrollHeight));
  }

  async loadMoreMessages(): Promise<void> {
    await this.scrollToTop();
    await this.page.waitForTimeout(1000); // Wait for lazy load
    await this.waitForLoadingToComplete();
  }

  // Assertions
  async expectMessagingLoaded(): Promise<void> {
    await expect(this.messagingContainer).toBeVisible();
  }

  async expectConversationsVisible(): Promise<void> {
    await expect(this.conversationsList).toBeVisible();
  }

  async expectChatVisible(): Promise<void> {
    await expect(this.chatContainer).toBeVisible();
  }

  async expectNoConversations(): Promise<void> {
    const noConversations = this.page.locator('[data-testid="no-conversations"], .no-conversations');
    await expect(noConversations).toBeVisible();
  }

  async expectMessageSent(text: string): Promise<void> {
    const message = this.messageItems.filter({ hasText: text }).last();
    await expect(message).toBeVisible();
  }

  async expectUnreadCount(count: number): Promise<void> {
    const unreadBadge = this.page.locator('[data-testid="total-unread"]');
    if (count > 0) {
      await expect(unreadBadge).toContainText(count.toString());
    } else {
      await expect(unreadBadge).not.toBeVisible();
    }
  }

  async expectTypingIndicator(): Promise<void> {
    const typing = this.page.locator('[data-testid="typing-indicator"]');
    await expect(typing).toBeVisible();
  }
}

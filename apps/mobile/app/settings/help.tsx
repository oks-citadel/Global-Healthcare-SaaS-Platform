import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '../../src/theme';
import { Card, Input, Button } from '../../src/components';
import apiClient from '../../src/api/client';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'How do I book an appointment?',
    answer: 'Navigate to the Appointments tab, tap the "+" button, select a doctor and available time slot, then confirm your booking. You\'ll receive a confirmation notification.',
  },
  {
    id: '2',
    question: 'Can I cancel or reschedule an appointment?',
    answer: 'Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time. Go to your appointment details and tap "Cancel" or "Reschedule".',
  },
  {
    id: '3',
    question: 'How do I access my medical records?',
    answer: 'Go to Profile > Medical History to view your complete medical records, prescriptions, test results, and visit history.',
  },
  {
    id: '4',
    question: 'Is my health data secure?',
    answer: 'Yes, we use industry-standard encryption and comply with HIPAA and GDPR regulations. Your data is stored securely and never shared without your explicit consent.',
  },
  {
    id: '5',
    question: 'How do I change my password?',
    answer: 'Go to Profile > Privacy & Security > Change Password. You\'ll need to enter your current password and choose a new secure password.',
  },
  {
    id: '6',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit cards, debit cards, and digital wallets. Insurance claims can also be processed through the app.',
  },
  {
    id: '7',
    question: 'How do I contact my doctor?',
    answer: 'You can message your doctor directly through the Messages tab, or schedule a video consultation through the Appointments feature.',
  },
  {
    id: '8',
    question: 'Can I share my health records with other doctors?',
    answer: 'Yes, you can export your medical records from Profile > Privacy & Security > Export My Data, or grant access to specific doctors through the app.',
  },
];

const CONTACT_OPTIONS = [
  {
    id: 'email',
    title: 'Email Support',
    description: 'support@unifiedhealth.com',
    icon: '📧',
    action: () => Linking.openURL('mailto:support@unifiedhealth.com'),
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: '+1 (800) 123-4567',
    icon: '📞',
    action: () => Linking.openURL('tel:+18001234567'),
  },
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Available 24/7',
    icon: '💬',
    action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
  },
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Browse our help articles',
    icon: '📚',
    action: () => Linking.openURL('https://docs.unifiedhealth.com'),
  },
];

export default function HelpScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) {
      Alert.alert('Missing Information', 'Please provide both subject and message.');
      return;
    }

    try {
      setSubmitting(true);

      await apiClient.post('/support/feedback', {
        subject: feedbackSubject,
        message: feedbackMessage,
      });

      Alert.alert(
        'Feedback Submitted',
        'Thank you for your feedback! We\'ll review it and get back to you if needed.'
      );

      // Clear form
      setFeedbackSubject('');
      setFeedbackMessage('');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to submit feedback. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Contact Support */}
      <Card variant="elevated" padding="lg" style={styles.card}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <Text style={styles.sectionDescription}>
          Choose your preferred way to reach us
        </Text>

        <View style={styles.contactList}>
          {CONTACT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.contactItem}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <View style={styles.contactIcon}>
                <Text style={styles.contactIconText}>{option.icon}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDescription}>{option.description}</Text>
              </View>
              <Text style={styles.contactChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* FAQ Section */}
      <Card variant="elevated" padding="lg" style={styles.card}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.sectionDescription}>
          Find quick answers to common questions
        </Text>

        <View style={styles.faqList}>
          {FAQ_DATA.map((faq, index) => {
            const isExpanded = expandedFAQ === faq.id;

            return (
              <View
                key={faq.id}
                style={[
                  styles.faqItem,
                  index === 0 && styles.faqItemFirst,
                  index === FAQ_DATA.length - 1 && styles.faqItemLast,
                ]}
              >
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={[styles.faqToggle, isExpanded && styles.faqToggleExpanded]}>
                    {isExpanded ? '−' : '+'}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqContent}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </Card>

      {/* Feedback Form */}
      <Card variant="elevated" padding="lg" style={styles.card}>
        <Text style={styles.sectionTitle}>Send Feedback</Text>
        <Text style={styles.sectionDescription}>
          Help us improve by sharing your thoughts and suggestions
        </Text>

        <View style={styles.feedbackForm}>
          <Input
            label="Subject"
            placeholder="What is your feedback about?"
            value={feedbackSubject}
            onChangeText={setFeedbackSubject}
            required
          />

          <Input
            label="Message"
            placeholder="Tell us more about your feedback..."
            value={feedbackMessage}
            onChangeText={setFeedbackMessage}
            multiline
            numberOfLines={6}
            style={styles.feedbackTextArea}
            required
          />

          <Button
            title="Submit Feedback"
            onPress={handleSubmitFeedback}
            loading={submitting}
            fullWidth
            size="lg"
          />
        </View>
      </Card>

      {/* Additional Resources */}
      <Card variant="elevated" padding="lg" style={styles.resourcesCard}>
        <Text style={styles.resourcesTitle}>Additional Resources</Text>

        <View style={styles.resourcesList}>
          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL('https://unifiedhealth.com/terms')}
            activeOpacity={0.7}
          >
            <Text style={styles.resourceText}>Terms of Service</Text>
            <Text style={styles.resourceChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL('https://unifiedhealth.com/privacy')}
            activeOpacity={0.7}
          >
            <Text style={styles.resourceText}>Privacy Policy</Text>
            <Text style={styles.resourceChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL('https://unifiedhealth.com/community')}
            activeOpacity={0.7}
          >
            <Text style={styles.resourceText}>Community Guidelines</Text>
            <Text style={styles.resourceChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL('https://status.unifiedhealth.com')}
            activeOpacity={0.7}
          >
            <Text style={styles.resourceText}>System Status</Text>
            <Text style={styles.resourceChevron}>›</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.lg,
  },
  contactList: {
    gap: spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: spacing.md,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contactIconText: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs / 2,
  },
  contactDescription: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  contactChevron: {
    fontSize: 24,
    color: colors.gray[400],
    marginLeft: spacing.sm,
  },
  faqList: {
    borderRadius: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.gray[50],
  },
  faqItem: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  faqItemFirst: {
    borderTopLeftRadius: spacing.md,
    borderTopRightRadius: spacing.md,
  },
  faqItemLast: {
    borderBottomLeftRadius: spacing.md,
    borderBottomRightRadius: spacing.md,
    borderBottomWidth: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[900],
    marginRight: spacing.md,
  },
  faqToggle: {
    fontSize: 24,
    color: colors.primary[500],
    fontWeight: typography.fontWeights.bold,
    width: 24,
    textAlign: 'center',
  },
  faqToggleExpanded: {
    color: colors.primary[600],
  },
  faqContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  faqAnswer: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    lineHeight: typography.lineHeights.md,
  },
  feedbackForm: {
    gap: spacing.xs,
  },
  feedbackTextArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  resourcesCard: {
    backgroundColor: colors.gray[100],
  },
  resourcesTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  resourcesList: {
    gap: spacing.xs,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#ffffff',
    borderRadius: spacing.md,
  },
  resourceText: {
    fontSize: typography.sizes.md,
    color: colors.primary[500],
    fontWeight: typography.fontWeights.medium,
  },
  resourceChevron: {
    fontSize: 20,
    color: colors.gray[400],
  },
});

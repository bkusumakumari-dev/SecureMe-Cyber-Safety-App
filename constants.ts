
import { Module } from './types';
import { AccountBreachChecker } from './components/AccountBreachChecker';
import { ScamPhishingGuard } from './components/ScamPhishingGuard';
import { ScamMessageAnalyzer } from './components/ScamMessageAnalyzer';
import { PasswordHygieneAnalyzer } from './components/PasswordHygieneAnalyzer';
import { CyberRiskScoreDashboard } from './components/CyberRiskScoreDashboard';
import { NetworkPrivacySafety } from './components/NetworkPrivacySafety';
import { IncidentResponseGuide } from './components/IncidentResponseGuide';
import { CyberAwarenessHub } from './components/CyberAwarenessHub';
import { PhoneNumberAnalyzer } from './components/PhoneNumberAnalyzer';

export const APP_NAME = "Secure Me-Cyber Safety App";
export const GEMINI_MODEL = "gemini-3-flash-preview";

export const MODULES: Module[] = [
  {
    id: 'account-breach-checker',
    name: 'Account Breach Checker',
    description: 'Check if your email address has been compromised in known data breaches.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Account Breach Checker:</h3>
      <p class="mb-4">This module helps you determine if your email account might have been exposed in a data breach using AI-powered analysis.</p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Enter your email address into the provided input field.</li>
        <li>Click the "Check for Breaches" button.</li>
        <li>The app will provide an AI-driven analysis against known breach patterns and display a result.</li>
        <li>Review the status and follow any recommendations to secure your account if a potential breach is detected (e.g., change password, enable 2FA).</li>
      </ol>
    `,
    component: AccountBreachChecker,
    cardBgClass: 'bg-blue-50',
    appBgClass: 'bg-blue-100',
    tips: [
      "Always use unique passwords for each online account.",
      "Enable Two-Factor Authentication (2FA) wherever possible.",
      "Regularly check breach databases for your email exposure.",
      "Be wary of emails asking for personal information, even if they seem legitimate.",
      "Update your passwords immediately if a breach is detected.",
    ],
  },
  {
    id: 'scam-phishing-guard',
    name: 'Scam & Phishing Guard (URL Safety)',
    description: 'Analyze URLs and links for potential scam or phishing threats.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Scam & Phishing Guard:</h3>
      <p class="mb-4">This tool helps you identify potentially malicious or phishing URLs before you click them using AI-powered analysis.</p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Copy and paste a suspicious URL or link into the input field.</li>
        <li>Click the "Analyze URL" button.</li>
        <li>The app will provide an AI-driven analysis, offering a safety rating (Safe, Suspicious, or Dangerous) and highlighting potential red flags.</li>
        <li>Always exercise caution with links from unknown sources, especially if this tool marks them as suspicious or dangerous.</li>
        <li>Never enter personal information on sites identified as suspicious or dangerous.</li>
      </ol>
    `,
    component: ScamPhishingGuard,
    cardBgClass: 'bg-green-50',
    appBgClass: 'bg-emerald-100',
    tips: [
      "Hover over links to see the real URL before clicking.",
      "Look for 'HTTPS' and a padlock icon in legitimate website addresses.",
      "Beware of typos or unusual characters in website URLs.",
      "If a deal seems too good to be true, it probably is.",
      "Always verify the sender of an email or message before trusting a link.",
    ],
  },
  {
    id: 'scam-message-analyzer',
    name: 'Scam Message Analyzer',
    description: 'Paste suspicious messages (email, SMS) to check for scam indicators.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Scam Message Analyzer:</h3>
      <p class="mb-4">Paste any suspicious text message, email content, or social media post to get an instant, AI-powered analysis for scam characteristics.</p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Copy the full content of a suspicious message (email body, SMS text, chat message).</li>
        <li>Paste it into the large text area provided.</li>
        <li>Click the "Analyze Message" button.</li>
        <li>The app will provide an AI-driven analysis, pointing out potential red flags like urgent language, unusual requests, or generic greetings, and offer a recommendation.</li>
        <li>If a message is identified as suspicious, do not respond, click any links, or download attachments.</li>
      </ol>
    `,
    component: ScamMessageAnalyzer,
    cardBgClass: 'bg-purple-50',
    appBgClass: 'bg-purple-100',
    tips: [
      "Scammers often use urgent or threatening language to rush you.",
      "Beware of messages asking for personal details, like bank accounts or passwords.",
      "Grammar and spelling errors are common in scam messages.",
      "Verify unexpected requests by contacting the sender through an official channel (not replying to the message).",
      "Don't click on links or download attachments from suspicious messages.",
    ],
  },
  {
    id: 'phone-number-analyzer',
    name: 'Phone Number Analyzer',
    description: 'Analyze phone numbers for validity, potential spam indicators, and public associations.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Phone Number Analyzer:</h3>
      <p class="mb-4">This module uses AI-powered analysis to check a phone number for its validity, potential spam flags, and any publicly available associations (like a business type).</p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Enter a phone number into the input field.</li>
        <li>Click the "Analyze Number" button.</li>
        <li>The app will provide an AI-driven assessment of its format, potential spam reports, and any general public associations (e.g., if it seems like a business number).</li>
        <li><strong>IMPORTANT PRIVACY NOTE:</strong> This tool does NOT provide individuals' private names or personal data. Its analysis is based on publicly discernible patterns and general categorizations.</li>
        <li>Use this tool to inform yourself about suspicious numbers or to check the general nature of an unknown contact.</li>
      </ol>
    `,
    component: PhoneNumberAnalyzer,
    cardBgClass: 'bg-cyan-50',
    appBgClass: 'bg-cyan-100',
    tips: [
      "Be cautious of unsolicited calls from unknown numbers.",
      "Spam calls often come from numbers that look similar to your own.",
      "Don't press any numbers if prompted by a suspicious automated call.",
      "Verify the identity of callers who claim to be from a bank or government agency.",
      "Block and report persistent spam callers.",
    ],
  },
  {
    id: 'password-hygiene-analyzer',
    name: 'Password Hygiene Analyzer',
    description: 'Assess the strength and security of your password practices without revealing your actual password.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Password Hygiene Analyzer:</h3>
      <p class="mb-4">This module evaluates the strength of your password practices based on characteristics like length and complexity, providing AI-powered advice without ever seeing your actual password.</p>
      <ol class="list-decimal list-inside space-y-2">
        <li><strong>DO NOT ENTER YOUR REAL PASSWORD.</strong> Instead, enter a dummy password with similar characteristics (length, type of characters used, etc.) to your actual password.</li>
        <li>Click the "Analyze Password" button.</li>
        <li>The app will provide AI-driven feedback on its strength and offer tips for improvement, emphasizing factors like length, diversity of characters (uppercase, lowercase, numbers, symbols), and avoiding common patterns.</li>
        <li>Always use unique, strong passwords for each of your online accounts.</li>
        <li>Consider using a reputable password manager to generate and store complex passwords securely.</li>
      </ol>
    `,
    component: PasswordHygieneAnalyzer,
    cardBgClass: 'bg-yellow-50',
    appBgClass: 'bg-yellow-100',
    tips: [
      "Aim for passwords at least 12-16 characters long.",
      "Mix uppercase, lowercase, numbers, and symbols for stronger passwords.",
      "Avoid using personal information, common words, or simple sequences.",
      "Use a password manager to securely generate and store complex passwords.",
      "Enable Two-Factor Authentication (2FA) for all critical accounts.",
    ],
  },
  {
    id: 'cyber-risk-score-dashboard',
    name: 'Cyber Risk Score Dashboard',
    description: 'Get an overview of your cyber safety posture with a personalized risk score.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Cyber Risk Score Dashboard:</h3>
      <p class="mb-4">This dashboard provides a holistic view of your cyber safety by aggregating assessments from other modules into a single risk score.</p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Your overall cyber risk score is displayed prominently (0-100, where 0 is high risk, 100 is low risk).</li>
        <li>Below the score, you'll see a breakdown of different risk factors (e.g., Breach Exposure, Phishing Vulnerability, Password Strength).</li>
        <li>Each factor is rated (Low, Medium, High, Critical) to show areas where you might be more vulnerable.</li>
        <li>To improve your score, engage with other modules in the app and follow their recommendations.</li>
        <li>Regularly check this dashboard to monitor your progress and maintain good cyber hygiene.</li>
      </ol>
    `,
    component: CyberRiskScoreDashboard,
    cardBgClass: 'bg-red-50',
    appBgClass: 'bg-fuchsia-100',
    tips: [
      "A higher score indicates better cyber hygiene; strive to keep it above 70.",
      "Focus on improving areas flagged as 'High' or 'Critical' risk.",
      "Regularly review your digital habits to ensure ongoing safety.",
      "The dashboard reflects your current posture; continuous vigilance is key.",
      "Share cyber safety tips with family and friends to build a safer community.",
    ],
  },
  {
    id: 'network-privacy-safety',
    name: 'Network & Privacy Safety',
    description: 'Guides and checklists for securing your network connections and device privacy settings.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Network & Privacy Safety:</h3>
      <p class="mb-4">This module offers essential, AI-generated advice and actionable checklists to help you secure your network connections (especially Wi-Fi) and manage your device's privacy settings effectively.</p>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Network & Wi-Fi Safety:</strong> Provides best practices for using public Wi-Fi, securing your home network, and understanding potential risks.</li>
        <li><strong>Device Privacy & Permission Management:</strong> Guides you through managing app permissions, location services, and other privacy settings on your devices (smartphones, computers).</li>
      </ul>
      <p>Read through the information, understand the risks, and apply the recommended settings or behaviors to enhance your digital safety.</p>
    `,
    component: NetworkPrivacySafety,
    cardBgClass: 'bg-indigo-50',
    appBgClass: 'bg-indigo-100',
    tips: [
      "Always use a VPN when connecting to public Wi-Fi networks.",
      "Secure your home Wi-Fi with a strong, unique password and WPA3 encryption.",
      "Regularly review and revoke unnecessary app permissions on your devices.",
      "Disable location services for apps that don't absolutely need them.",
      "Keep your operating system and all applications updated to the latest versions.",
    ],
  },
  {
    id: 'incident-response-guide',
    name: 'Incident Response Guide',
    description: 'Step-by-step instructions for handling common cyber incidents like account hacks or malware.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Incident Response Guide:</h3>
      <p class="mb-4">Knowing what to do when a cyber incident occurs can significantly reduce damage. This guide provides immediate, actionable, AI-generated steps for various scenarios.</p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Select the type of cyber incident you are facing from the dropdown or list (e.g., "Hacked Email Account", "Malware Infection").</li>
        <li>Read the detailed, step-by-step instructions for that specific incident.</li>
        <li>Follow the steps carefully and calmly to contain the incident, recover your systems, and prevent future occurrences.</li>
        <li>Remember to always back up your important data regularly to aid in recovery.</li>
        <li>If you are unsure or the situation is critical, apply these guidelines and consider professional cybersecurity help.</li>
      </ol>
    `,
    component: IncidentResponseGuide,
    cardBgClass: 'bg-teal-50',
    appBgClass: 'bg-teal-100',
    tips: [
      "Stay calm and follow the steps systematically during an incident.",
      "Disconnect compromised devices from the internet immediately.",
      "Change passwords for all affected accounts and any linked accounts.",
      "Notify relevant parties (e.g., bank, service provider, trusted contacts).",
      "Regular backups are crucial for data recovery after an attack.",
    ],
  },
  {
    id: 'cyber-awareness-hub',
    name: 'Cyber Awareness Hub',
    description: 'Educational resources on malware, digital footprint, dark web exposure, and attack patterns.',
    howToUse: `
      <h3 class="text-lg font-bold mb-2">How to Use Cyber Awareness Hub:</h3>
      <p class="mb-4">The Cyber Awareness Hub is your go-to resource for understanding various cybersecurity threats and best practices. Knowledge is your best defense!</p>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Malware Risk Awareness:</strong> Learn about different types of malware, how they spread, and effective prevention strategies.</li>
        <li><strong>Digital Footprint & Metadata Awareness:</strong> Understand what your digital footprint is, its implications for privacy, and how to manage your online presence.</li>
        <li><strong>Dark Web Exposure Awareness:</strong> Get an overview of the dark web and how to mitigate risks associated with your data potentially being exposed there.</li>
        <li><strong>Attack Pattern Recognition:</strong> Familiarize yourself with common cyber attack techniques to better recognize and defend against them.</li>
      </ul>
      <p>Explore each section to deepen your understanding of cybersecurity concepts and strengthen your overall defense.</p>
    `,
    component: CyberAwarenessHub,
    cardBgClass: 'bg-orange-50',
    appBgClass: 'bg-orange-100',
    tips: [
      "Continuous learning is your best defense against evolving cyber threats.",
      "Understand what information you share online to manage your digital footprint.",
      "Be aware of the tactics used in social engineering to avoid becoming a victim.",
      "Stay updated on the latest cybersecurity news and best practices.",
      "Educate family and friends about common cyber risks to protect your loved ones.",
    ],
  },
];

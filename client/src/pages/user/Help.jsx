import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserProtectedRoute from '../../components/UserProtectedRoute'
import SEO from '../../components/SEO'
import {
    HiQuestionMarkCircle,
    HiChatBubbleLeftRight,
    HiBookOpen,
    HiEnvelope,
    HiChevronDown,
    HiChevronUp,
} from 'react-icons/hi2'

function Help() {
    const [openFaq, setOpenFaq] = useState(null)

    const faqs = [
        {
            question: 'How do I get more tokens?',
            answer: 'You can purchase tokens by going to the Billing & Tokens page and selecting a token package that suits your needs. We offer various packages starting from 50 tokens.',
        },
        {
            question: 'What tools are available?',
            answer: 'We offer AI-powered tools for resume generation, cover letter writing, email composition, interview preparation, skills assessment, and salary negotiation. All tools are accessible from the Tools page.',
        },
        {
            question: 'How many tokens does each tool use?',
            answer: 'Different tools consume different amounts of tokens based on complexity. Resume and cover letter generation typically use 5-10 tokens, while interview prep and skills assessment use 3-7 tokens. The exact amount is shown before you use each tool.',
        },
        {
            question: 'Can I get a refund for unused tokens?',
            answer: 'Tokens are non-refundable once purchased. However, they never expire, so you can use them whenever you need. If you have concerns about a purchase, please contact our support team.',
        },
        {
            question: 'How do I update my profile information?',
            answer: 'Go to your Profile page where you can edit your display name, bio, location, and website. Click the "Edit Profile" button to make changes.',
        },
        {
            question: 'How do I change my password?',
            answer: 'Navigate to Settings, then select the Security tab. Enter your current password and your new password twice to confirm. Your password must be at least 8 characters long.',
        },
        {
            question: 'What if I forget my password?',
            answer: 'On the login page, click "Forgot Password" and follow the instructions. You\'ll receive an email with a link to reset your password.',
        },
        {
            question: 'How do I manage my notification preferences?',
            answer: 'Go to Settings > Notifications to customize which emails you receive. You can control account notifications, product updates, weekly digests, and marketing emails.',
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes! We use industry-standard encryption to protect your data. Your information is stored securely and we never share your personal data with third parties without your consent.',
        },
        {
            question: 'How do I delete my account?',
            answer: 'If you wish to delete your account, please contact our support team at munenemuchokiofficial@gmail.com. We\'ll process your request within 24-48 hours.',
        },
    ]

    const resources = [
        {
            icon: HiBookOpen,
            title: 'Documentation',
            description: 'Comprehensive guides on using our AI tools',
            link: '/blog',
            color: 'blue',
        },
        {
            icon: HiChatBubbleLeftRight,
            title: 'Community',
            description: 'Join our community to connect and learn',
            link: '/community',
            color: 'purple',
        },
        {
            icon: HiEnvelope,
            title: 'Email Support',
            description: 'Get help directly from our team',
            link: '/contact',
            color: 'green',
        },
    ]

    return (
        <UserProtectedRoute>
            <SEO
                title="Help & Support"
                description="Get help with using our platform, find answers to common questions, and contact support"
                url="/user/help"
            />
            <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block p-4 rounded-full bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 dark:from-neon-blue/20 dark:to-neon-purple/20 mb-6">
                            <HiQuestionMarkCircle className="w-16 h-16 text-neon-blue" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                            How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Help?</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Find answers, get support, and learn how to make the most of our platform
                        </p>
                    </div>

                    {/* Quick Resources */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {resources.map((resource) => (
                            <Link
                                key={resource.title}
                                to={resource.link}
                                className="glass-panel p-6 rounded-xl hover:border-neon-blue/30 transition-all group"
                            >
                                <div className={`p-3 rounded-lg bg-${resource.color}-100 dark:bg-${resource.color}-900/30 inline-block mb-4 group-hover:scale-110 transition-transform`}>
                                    <resource.icon className={`w-6 h-6 text-neon-${resource.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
                            </Link>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                                        {openFaq === index ? (
                                            <HiChevronUp className="w-5 h-5 text-neon-blue flex-shrink-0" />
                                        ) : (
                                            <HiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-white/10 pt-6">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="mt-12 glass-panel p-8 rounded-2xl text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still Need Help?</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Can't find what you're looking for? Our support team is here to help!
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-8 rounded-xl hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 hover:-translate-y-0.5"
                        >
                            <HiEnvelope className="w-5 h-5" />
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </UserProtectedRoute>
    )
}

export default Help

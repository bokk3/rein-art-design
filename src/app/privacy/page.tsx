export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>

        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              When you contact us through our contact form, we collect the following information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Project type information</li>
              <li>Your message content</li>
              <li>Your consent preferences for privacy and marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your personal information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>To respond to your inquiries and provide customer support</li>
              <li>To communicate with you about your project requirements</li>
              <li>To send you updates about our services (only if you have consented)</li>
              <li>To improve our services and website functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
            <p className="text-gray-700 mb-4">
              Under GDPR, we process your personal data based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Consent:</strong> When you provide explicit consent for marketing communications</li>
              <li><strong>Legitimate Interest:</strong> To respond to your inquiries and provide requested services</li>
              <li><strong>Contract Performance:</strong> To fulfill any service agreements we may enter into</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Contact form submissions: 3 years from the date of submission</li>
              <li>Marketing consent: Until you withdraw consent or 3 years of inactivity</li>
              <li>Service-related communications: For the duration of our business relationship plus 1 year</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights Under GDPR</h2>
            <p className="text-gray-700 mb-4">
              As a data subject, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security updates and monitoring</li>
              <li>Limited access to personal data on a need-to-know basis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies to enhance your browsing experience and analyze website traffic. You can control cookie 
              preferences through our cookie consent banner, which appears on your first visit. We respect your choices 
              and only use cookies that you have consented to.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Cookie Categories</h3>

            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Essential Cookies</h4>
              <p className="text-gray-700 mb-2">
                These cookies are strictly necessary for the website to function properly. They cannot be disabled 
                as they are essential for basic site functionality, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Authentication and session management</li>
                <li>Security features and fraud prevention</li>
                <li>Cookie consent preference storage</li>
                <li>Language preference storage</li>
              </ul>
              <p className="text-sm text-gray-600 italic">
                These cookies are always active and do not require your consent under GDPR.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Analytics Cookies</h4>
              <p className="text-gray-700 mb-2">
                These cookies help us understand how visitors interact with our website by collecting and reporting 
                information anonymously. They enable us to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Analyze website usage and visitor behavior</li>
                <li>Identify popular content and pages</li>
                <li>Improve website performance and user experience</li>
                <li>Measure the effectiveness of our content</li>
              </ul>
              <p className="text-sm text-gray-600 italic">
                These cookies are optional and require your explicit consent. We use privacy-focused analytics that 
                do not share data with third parties.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Marketing Cookies</h4>
              <p className="text-gray-700 mb-2">
                These cookies are used to deliver personalized advertisements and track campaign performance. They enable us to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Show you relevant advertisements based on your interests</li>
                <li>Measure the effectiveness of our marketing campaigns</li>
                <li>Limit the number of times you see an advertisement</li>
              </ul>
              <p className="text-sm text-gray-600 italic">
                These cookies are optional and require your explicit consent. Currently, we do not use marketing cookies, 
                but this option is available for future use.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Managing Your Cookie Preferences</h3>
            <p className="text-gray-700 mb-4">
              You can manage your cookie preferences at any time:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Click on the cookie banner that appears when you first visit our website</li>
              <li>Use the "Customize" option to select which cookie categories you accept</li>
              <li>Change your preferences later by clicking the cookie settings link (if available)</li>
              <li>Clear your browser cookies to reset your preferences (you will be asked again on your next visit)</li>
            </ul>

            <p className="text-gray-700 mb-4">
              Your cookie preferences are stored in your browser session and will be remembered across page visits. 
              If you clear your browser cookies, you will need to set your preferences again.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Third-Party Cookies</h3>
            <p className="text-gray-700 mb-4">
              We do not currently use third-party cookies. If we implement third-party services in the future that 
              require cookies, we will update this policy and ensure they comply with GDPR requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Email delivery (with appropriate data processing agreements)</li>
              <li>Website hosting and infrastructure</li>
              <li>Database services</li>
            </ul>
            <p className="text-gray-700 mb-4">
              All third-party processors are GDPR-compliant and have appropriate data processing agreements in place.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For any privacy-related questions or to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@example.com
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> Brussels, Belgium
              </p>
              <p className="text-gray-700">
                <strong>Response Time:</strong> We will respond to your request within 30 days as required by GDPR.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. We will notify you of any material changes by 
              posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>

        {/* Back to contact */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a 
            href="/contact"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to Contact
          </a>
        </div>
      </main>
    </div>
  )
}
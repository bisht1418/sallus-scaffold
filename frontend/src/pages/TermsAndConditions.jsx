import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Mail, Book, CreditCard, UserX, Shield, Copyright, Lock, AlertTriangle, RefreshCw, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsSection = ({ title, children, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-4 border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-700">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

const TermsAndConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <>
    <Header/>
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Salus Scaffold Terms & Conditions</h1>
        <p className="text-gray-600">Please review our terms and conditions carefully</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-6">
          <TermsSection title="Introduction" icon={Book}>
            <p className="text-gray-600">By using our subscription service, you agree to these terms.</p>
          </TermsSection>

          <TermsSection title="Subscription Plans" icon={CreditCard}>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Various plans available; must be 18+ to subscribe</li>
              <li>Keep login details secure</li>
            </ul>
          </TermsSection>

          <TermsSection title="Billing & Payment" icon={CreditCard}>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Payment methods: Credit cards, PayPal, etc.</li>
              <li>Monthly or annual billing; auto-renews unless canceled</li>
              <li>Generally non-refundable, with exceptions at our discretion</li>
            </ul>
          </TermsSection>

          <TermsSection title="Cancellations & Termination" icon={UserX}>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Cancel anytime; effective at the cycle's end</li>
              <li>Accounts may be terminated for violations</li>
            </ul>
          </TermsSection>

          <TermsSection title="User Conduct" icon={Shield}>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>No unlawful use; report unauthorized access</li>
              <li>Account sharing is not allowed</li>
            </ul>
          </TermsSection>

          <TermsSection title="Intellectual Property" icon={Copyright}>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Service content is owned by Salus Scaffold</li>
              <li>Limited, non-transferable license for personal or business use</li>
            </ul>
          </TermsSection>

          <TermsSection title="Privacy" icon={Lock}>
            <p className="text-gray-600">We prioritize protecting your personal information.</p>
          </TermsSection>

          <TermsSection title="Limitation of Liability" icon={AlertTriangle}>
            <p className="text-gray-600">Salus Scaffold is not liable for indirect damages; total liability is capped at the subscription fee paid in the past 12 months.</p>
          </TermsSection>

          <TermsSection title="Changes to Terms" icon={RefreshCw}>
            <p className="text-gray-600">Terms may be updated; continued use after updates means acceptance.</p>
          </TermsSection>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-600">
              <Phone className="w-5 h-5" />
              <h3 className="font-semibold">Contact Us</h3>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <a href="mailto:post@salsusscaffold.com" className="hover:text-blue-600">post@salsusscaffold.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default TermsAndConditions;
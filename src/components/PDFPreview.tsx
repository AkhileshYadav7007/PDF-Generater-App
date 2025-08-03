'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '@/types';
import { generatePDF } from '@/utils/pdfGenerator';

const PDFPreview: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        router.push('/');
      }
    } else {
      // No data found, redirect to form
      router.push('/');
    }
  }, [router]);

  const handleBack = () => {
    router.push('/');
  };

  const handleDownloadPDF = async () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      await generatePDF(formData, 'pdf-content');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
          >
            ← Back to Form
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isLoading}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* PDF Preview Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div id="pdf-content" className="p-12 bg-white">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Details</h1>
              <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900 font-medium">{formData.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Email Address
                    </label>
                    <p className="text-lg text-gray-900">{formData.email}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900">{formData.phone}</p>
                  </div>
                  
                  {formData.position && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Position
                      </label>
                      <p className="text-lg text-gray-900">{formData.position}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description Section */}
            {formData.description && (
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
                  Description
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {formData.description}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="text-center text-gray-500 text-sm">
                <p>Generated on {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-friendly buttons at bottom */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:hidden">
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
          >
            ← Back to Form
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isLoading}
            className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
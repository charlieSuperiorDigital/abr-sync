'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CustomInput } from '@/components/custom-components/inputs/custom-input'
import { CustomButton } from '@/components/custom-components/buttons/custom-button'
import { Upload } from 'lucide-react'
import { z } from 'zod'
import { createTenant, CreateTenantRequest } from '@/app/api/functions/tenant'

// Step indicators at the top of the form
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="register-page w-full flex justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex-1 relative px-2">
          <div 
            className={`h-1 ${index < currentStep ? 'bg-black' : 'bg-gray-200'}`}
          />
        </div>
      ))}
    </div>
  )
}

// Form schemas for validation
const accountInfoSchema = z.object({
  adminFullName: z.string().min(1, "Full name is required"),
  adminEmail: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  acceptPrivacy: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy",
  }),
  isAuthorized: z.boolean().refine(val => val === true, {
    message: "You must confirm you are authorized",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const emailVerificationSchema = z.object({
  verificationCode: z.string().min(1, "Verification code is required"),
});

const shopInfoSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  shopAddress: z.string().min(1, "Shop address is required"),
  shopPhoneNo: z.string().min(1, "Shop phone number is required"),
  shopEmail: z.string().email("Invalid email address"),
});

const cccIntegrationSchema = z.object({
  cccApiKey: z.string().min(1, "CCC API Key is required"),
  adminEmail: z.string().email("Invalid email address"),
  adminPassword: z.string().min(1, "Password is required"),
});

const paymentDetailsSchema = z.object({
  cardNumber: z.string().min(16, "Invalid card number"),
  expiryDate: z.string().min(5, "Invalid expiry date"),
  cvc: z.string().min(3, "Invalid CVC"),
});

export default function RegisterTenant() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [currentStep, setCurrentStep] = useState(1);
  // No need for password visibility state as it's handled by CustomInput
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form data state
  const [formData, setFormData] = useState({
    // Account Info
    adminFullName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    acceptPrivacy: false,
    isAuthorized: false,
    
    // Email Verification
    verificationCode: '',
    
    // Shop Info
    shopName: '',
    shopAddress: '',
    shopPhoneNo: '',
    shopEmail: '',
    shopLogo: null,
    
    // CCC Integration
    cccApiKey: '',
    cccAdminEmail: '',
    cccAdminPassword: '',
    
    // Platform Fees
    locationFee: 'x$ per location / mo',
    reportsChat: '$0',
    
    // Payment Details
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const validateCurrentStep = () => {
    setErrors({});
    
    try {
      switch (currentStep) {
        case 1: // Account Info
          accountInfoSchema.parse({
            adminFullName: formData.adminFullName,
            adminEmail: formData.adminEmail,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            agreeToTerms: formData.agreeToTerms,
            acceptPrivacy: formData.acceptPrivacy,
            isAuthorized: formData.isAuthorized,
          });
          break;
          
        case 2: // Email Verification
          // For now, we're skipping actual verification as mentioned
          break;
          
        case 3: // Shop Info
          shopInfoSchema.parse({
            shopName: formData.shopName,
            shopAddress: formData.shopAddress,
            shopPhoneNo: formData.shopPhoneNo,
            shopEmail: formData.shopEmail,
          });
          break;
          
        case 4: // CCC Integration
          cccIntegrationSchema.parse({
            cccApiKey: formData.cccApiKey,
            adminEmail: formData.cccAdminEmail,
            adminPassword: formData.cccAdminPassword,
          });
          break;
          
        case 5: // Platform Fees
          // No validation needed for this step
          break;
          
        case 6: // Payment Details
          paymentDetailsSchema.parse({
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvc: formData.cvc,
          });
          break;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmitTenant = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Prepare the tenant data according to the API requirements
      const tenantData: CreateTenantRequest = {
        name: formData.shopName,
        email: formData.shopEmail,
        phone: formData.shopPhoneNo,
        address: formData.shopAddress,
        logoUrl: '', // We'll skip this for now as mentioned
        cccApiKey: formData.cccApiKey
      };
      
      console.log('Submitting tenant data:', tenantData);
      
      // Call the API to create the tenant
      const tenantId = await createTenant(tenantData);
      
      console.log('Tenant created successfully with ID:', tenantId);
      
      // Redirect to the tenants list page
      router.push(`/${locale}/super-admin/dashboard/tenants`);
    } catch (error) {
      console.error('Failed to create tenant:', error);
      setSubmitError('Failed to create tenant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (currentStep === 6) {
      // Final step - submit the form
      handleSubmitTenant();
      return;
    }
    
    // For email verification step, skip validation
    if (currentStep === 2) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    const isValid = validateCurrentStep();
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render different form steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Account Info</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <CustomInput
                  label="Admin Full Name"
                  name="adminFullName"
                  value={formData.adminFullName}
                  onChange={handleInputChange}
                  error={errors.adminFullName}
                />
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Admin Email"
                  name="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  error={errors.adminEmail}
                />
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Create Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                />
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="agreeToTerms" 
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleCheckboxChange('agreeToTerms', checked === true)}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to <a href="#" className="underline">Terms & Conditions</a>
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="acceptPrivacy" 
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => handleCheckboxChange('acceptPrivacy', checked === true)}
                  />
                  <Label htmlFor="acceptPrivacy" className="text-sm">
                    I accept <a href="#" className="underline">Privacy Policy</a>
                  </Label>
                </div>
                {errors.acceptPrivacy && <p className="text-red-500 text-sm">{errors.acceptPrivacy}</p>}
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isAuthorized" 
                    checked={formData.isAuthorized}
                    onCheckedChange={(checked) => handleCheckboxChange('isAuthorized', checked === true)}
                  />
                  <Label htmlFor="isAuthorized" className="text-sm">
                    I'm an Authorized Officer with the authority to bind the company: CC: Legal
                  </Label>
                </div>
                {errors.isAuthorized && <p className="text-red-500 text-sm">{errors.isAuthorized}</p>}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Email Verification</h2>
            <p className="mb-6">Please enter the code received by email.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <CustomInput
                  label="Code"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Didn't get it?</span>
                <CustomButton
                  type="button"
                  variant="underlined"
                  onClick={() => console.log('Resend button clicked')}
                >
                  Resend
                </CustomButton>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Shop Info</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Shop Logo:</Label>
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
                  <Upload size={24} className="text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Shop Name"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  error={errors.shopName}
                />
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Shop Address"
                  name="shopAddress"
                  value={formData.shopAddress}
                  onChange={handleInputChange}
                  error={errors.shopAddress}
                />
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Shop Phone No"
                  name="shopPhoneNo"
                  value={formData.shopPhoneNo}
                  onChange={handleInputChange}
                  error={errors.shopPhoneNo}
                />
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Shop Email"
                  name="shopEmail"
                  type="email"
                  value={formData.shopEmail}
                  onChange={handleInputChange}
                  error={errors.shopEmail}
                />
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">CCC Integration</h2>
            <p className="mb-4">Integration will take up to 5 minutes. <a href="#" className="underline">Learn more about CCC integration</a></p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <CustomInput
                  label="CCC API Key"
                  name="cccApiKey"
                  value={formData.cccApiKey}
                  onChange={handleInputChange}
                  error={errors.cccApiKey}
                />
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Admin Email"
                  name="cccAdminEmail"
                  type="email"
                  value={formData.cccAdminEmail}
                  onChange={handleInputChange}
                  error={errors.adminEmail}
                />
              </div>
              
              <div className="space-y-2">
                <CustomInput
                  label="Admin Password"
                  name="cccAdminPassword"
                  type="password"
                  value={formData.cccAdminPassword}
                  onChange={handleInputChange}
                  error={errors.adminPassword}
                />
              </div>
              
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">
                  You'll have the option to add, edit, or remove locations on your shop admin locations dashboard.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Platform Fees</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Location Fee</h3>
                  <p className="text-sm text-gray-500">Location fee is automatic based on the locations.</p>
                </div>
                <div className="font-medium">$x per location / mo</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Reports Chat</h3>
                  <p className="text-sm text-gray-500">You will automatically have a one-month trial. Afterward, you can choose to continue manually.</p>
                </div>
                <div className="font-medium">$0</div>
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Payment Details</h2>
            <p className="mb-4">Powered by Stripe.</p>
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {submitError}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Card Information</label>
                <div className="rounded-lg overflow-hidden border border-black">
                  {/* Card Number */}
                  <div className="relative">
                    <input
                      name="cardNumber"
                      placeholder="1234 1234 1234 1234"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 outline-none"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="flex space-x-1">
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-black"></div>
                  
                  {/* Expiry and CVC */}
                  <div className="flex">
                    <div className="flex-1 relative">
                      <input
                        name="expiryDate"
                        placeholder="MM / YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 outline-none"
                      />
                    </div>
                    
                    {/* Vertical divider */}
                    <div className="border-l border-black"></div>
                    
                    <div className="flex-1 relative">
                      <input
                        name="cvc"
                        placeholder="CVC"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 outline-none"
                      />
                    </div>
                  </div>
                </div>
                {(errors.cardNumber || errors.expiryDate || errors.cvc) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardNumber || errors.expiryDate || errors.cvc}
                  </p>
                )}
              </div>
              
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen p-5">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Tenant Registration</h1>
        
        <div className="rounded-lg shadow-sm overflow-hidden">
          <StepIndicator currentStep={currentStep} totalSteps={6} />
          
          <div className="p-8">
            {renderStep()}
            
            <div className="flex justify-between mt-12">
              {currentStep > 0 ? (
                <CustomButton variant="outlined" onClick={handleBack}>
                  Go back
                </CustomButton>
              ) : (
                <div></div>
              )}
              
              <CustomButton 
                onClick={handleContinue}
                variant="filled"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {currentStep === 6 ? 'Pay & Complete' : 'Continue'}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
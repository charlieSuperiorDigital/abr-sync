import * as z from 'zod'

export const shopInfoSchema = z.object({
  shopLogo: z.any().optional(), // We'll handle file validation separately
  shopName: z.string().min(1, 'Shop name is required'),
  shopAddress: z.string().min(1, 'Shop address is required'),
  shopPhoneNo: z.string().min(1, 'Phone number is required'),
  shopEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export type ShopInfoFormData = z.infer<typeof shopInfoSchema>

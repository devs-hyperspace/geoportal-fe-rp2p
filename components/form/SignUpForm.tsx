'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    noKab: z.number().min(1, 'Silahkan pilih kota').refine((value) => value !== 0, { message: 'Silahkan pilih kota' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  });

const SignUpForm = () => {

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      noKab:0,
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
        no_kab: values.noKab
      }),
      })

    if(response.ok){
      router.push('/');
    }else{
      console.error('Registration failed');
    }
    

  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='johndoe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-Enter your password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Re-Enter your password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noKab"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Kode Kota/Kabupaten</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded px-3 py-2"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value={0} disabled>
                      Pilih Kode Kota/Kabupaten
                    </option>
                    {Array.from({ length: 514 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6' type='submit'>
          Sign up
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;

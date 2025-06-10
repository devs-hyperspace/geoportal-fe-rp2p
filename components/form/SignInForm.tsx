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
import { signIn} from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
    username: z.string().min(1, 'Username harus terisi').max(100),
    password: z.string().min(1, 'Password harus terisi').min(8, 'Password harus memiliki setidaknya 8 karakter'),
})

const SignInForm = () => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false
    })

    if (signInData?.error) {  
      toast({
        title: "Error",
        description: "Username or Password invalid",
        variant: 'destructive',
      })

      
    } else if (signInData?.status === 200) {
      router.refresh();
      router.push('/');
    } else {
      console.error("Unexpected response:", signInData);
    }
  };

  return (
    <div className='w-full h-full flex items-center justify-center'>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-1/4 bg-slate-100 p-8 rounded shadow'>
        <div className='space-y-2'>
          <h3 className='font-bold text-center'>RP2P KEMENDAGRI</h3>
          <p className='font-bold text-center'>Login Page</p>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormControl>
                  <Input 
                  id="username" 
                  aria-describedby="username-description"
                  placeholder='Enter your username' {...field} />
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
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    aria-describedby="password-description"
                    type='password'
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6' type='submit'>
          Sign in
        </Button>
      </form>
    </Form>
    </div>
  );
};

export default SignInForm;

'use client';

import { UserDashboardService } from '@/apis';
import { BurgurIcon } from '@/assets/images/svg/Burgur';
import { LogIn01Icon } from '@/assets/images/svg/LogIn01';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';
import { Separator } from '@/components/ui/separator';
import ReactQuery from '@/configs/react_query_keys';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store';
import { setUserProfile } from '@/store/userProfileSlice';
import { getToken } from '@/utils/cookies';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu } from './Menu';

const Header = () => {
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: [ReactQuery.userProfileDetail],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetcurrentuserprofiledetailGet(),
    enabled: !!token,
  });

  useEffect(() => {
    if (profileResponse) {
      dispatch(setUserProfile(profileResponse));
    }
  }, [dispatch, profileResponse]);

  useEffect(() => {
    const checkToken = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const tokenValue = getToken();
      setToken(tokenValue);
      setIsLoading(false);
    };

    checkToken();
  }, [token, dispatch]);

  return (
    <header className="relative z-30 bg-base-black" role="banner">
      <div className="max-w-[1440px] mx-auto p-4 pb-0 md:px-16 md:pt-8 md:pb-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link aria-label="صفحه اصلی" href="/">
            <Image
              priority
              alt="لوگو"
              height={34}
              src="/images/logo.svg"
              width={40}
            />
          </Link>
          <TextInput
            aria-label="جستجو"
            className="w-80 hidden md:block"
            placeholder="جستجو"
          />
        </div>
        <Button
          className="block md:hidden"
          variant="link"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <BurgurIcon height={24} width={24} />
        </Button>
        <Button
          aria-label={token ? 'ورود به داشبورد' : 'ورود/ ثبت نام'}
          asChild={!isLoading}
          className={cn(isLoading && 'w-[144px]', 'hidden md:flex')}
          disabled={isLoading}
          loading={isLoading}
          size="lg"
          onClick={isLoading ? e => e.preventDefault() : undefined}
        >
          {isLoading ? (
            <span>{token ? 'ورود به داشبورد' : 'ورود/ ثبت نام'}</span>
          ) : (
            <Link href="/auth">
              {token ? (
                'ورود به داشبورد'
              ) : (
                <>
                  <LogIn01Icon aria-hidden="true" /> ورود/ ثبت نام
                </>
              )}
            </Link>
          )}
        </Button>
      </div>
      <Separator className="my-3" />
      <nav
        aria-label="منوی اصلی"
        className="mx-auto max-w-[1440px]"
        role="navigation"
      >
        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </nav>
    </header>
  );
};

export default Header;

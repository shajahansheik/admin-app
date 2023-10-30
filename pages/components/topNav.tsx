import { Children, Fragment, useEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: false },
    { name: 'Users', href: '/users', icon: UsersIcon, current: false },
    { name: 'Visitors', href: '/visitors', icon: FolderIcon, current: false },
    { name: 'Career', href: '/career', icon: CalendarIcon, current: false },
    { name: 'Articles', href: '/articles', icon: DocumentDuplicateIcon, current: false },
    // { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]
const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]
const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function TopNav() {
    const router = useRouter();
const [open,setOpen]=useState<any>(false)
    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        setOpen(false);
        window.location.href = '/login';
    }
    return (
        <div>

            <div className="flex  gap-x-4 self-stretch items-center justify-between  lg:gap-x-6 px-3 py-2 border-b">
                <div className='text-[1.8vw] font-semibold capitalize'>{router?.pathname?.replace('/', '')}</div>
                <div className="flex items-center w-full justify-end  gap-x-4 lg:gap-x-6">

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="-m-1.5 flex items-center p-1.5">
                            <span className="sr-only">Open user menu</span>
                            <span onClick={()=>setOpen(!open)} className="h-12 lg:h-[3.2vw] w-12 lg:w-[3.2vw] flex items-center justify-center text-base lg:text-[1.3vw] font-semibold rounded-full bg-gray-200">
                                <svg className="h-8 lg:h-[1.8vw] lg:w-[1.8vw] w-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </span>
                        </Menu.Button>
                        <Transition show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                {/* {userNavigation.map((item) => (
                                    <Menu.Item key={item.name}>
                                        {({ active }) => (
                                            <a
                                                href={item.href}
                                                className={classNames(
                                                    active ? 'bg-gray-50' : '',
                                                    'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                )}
                                            >
                                                {item.name}
                                            </a>
                                        )}
                                    </Menu.Item>
                                ))} */}
                                <div className='flex items-center justify-center'>
                                    <div></div>
                                    <div onClick={() => logout()} className='hover:bg-gray-200 w-full text-center py-[0.5vw]'>
                                        Logout
                                    </div>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

        </div>
    );
}

export default TopNav;
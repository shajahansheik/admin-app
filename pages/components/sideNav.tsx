import { Children, Fragment, useState } from 'react'
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
import TopNav from './topNav'
import { useRouter } from 'next/router'

const navigation = [
    // { name: 'dashboard', href: '/dashboard', icon: HomeIcon, current: false },
    { name: 'users career', href: '/users', icon: UsersIcon, current: false },
    { name: 'visitors', href: '/visitors', icon: FolderIcon, current: false },
    { name: 'career', href: '/career', icon: CalendarIcon, current: false },
    { name: 'articles', href: '/articles', icon: DocumentDuplicateIcon, current: false },
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


function SideNav() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter();

    return (

        < div className=" lg:flex lg:w-[20vw] lg:flex-col h-screen py-[1vw]" >
            {/* Sidebar component, swap this element with another sidebar if you like */}
            < div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4" >
                <div className="">
                    {/* <img
                                className="h-16 w-auto"
                                src="https://bondaf.com/media/images/logo/Logo%20text%20-%20dark.png"
                                alt="Your Company"
                            /> */}
                    <img src='https://bondaf.com/media/images/logo/Logo%20text%20-%20dark.svg' className='bondaflogo' alt='logo' />
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item:any,idx:number) => (
                                    <li key={idx}>
                                        <a
                                            href={item.href}
                                            className={classNames(
                                                (router?.pathname?.replace('/', '') === (item.name ==='users career' ?'users':item?.name))
                                                    ? 'bg-gray-50 text-[#3399FF]'
                                                    : 'text-gray-700 hover:text-[#3399FF] hover:bg-gray-50',
                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold capitalize'
                                            )}
                                        >
                                            {/* <item.icon
                                                className={classNames(
                                                    router?.pathname?.replace('/', '') === item.name ? 'text-[#3399FF]' : 'text-gray-400 group-hover:text-[#3399FF]',
                                                    'h-6 w-6 shrink-0'
                                                )}
                                                aria-hidden="true"
                                            /> */}
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>

                    </ul>
                </nav>
            </div >
            {/* <TopNav /> */}
        </div >

    );
}

export default SideNav;
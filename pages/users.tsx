import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from './components/layout';
import axios from 'axios';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Users(data: any) {
// let token = localStorage.getItem('token');




    const [usersList, setUsersList] = useState<any>(data?.data?.users)
    const checkbox: any = useRef()
    const [checked, setChecked] = useState<any>(false)
    const [indeterminate, setIndeterminate] = useState<any>(false)
    const [selectedUsers, setSelectedUsers] = useState<any>([])
    const [fiterType, setFilterType] = useState("all");
    const [resetData, setResetData] = useState<any>()


    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dupVisitors, setDupVisitors] = useState<any>(data?.data?.users)
    useEffect( ()=>{
        let storedValue:any='';
        // const res = fetch(`https://bondaf-api.azurewebsites.net/users/list`);
        // let data = (res.json());
        if (typeof window !== 'undefined') {
            // Access localStorage here
             storedValue = localStorage.getItem('token');
            console.log(storedValue);
          }
        axios.get(`https://bondaf-api.azurewebsites.net/users/list`,{
            headers: {
                'Authorization': `Bearer ${storedValue}`,
                
              }
        }).then((res:any)=>{
    console.log("res",res);
    setUsersList(res?.data?.users);
    setDupVisitors(res?.data?.users);
    setResetData(res?.data?.users)
        })
    },[])


    useEffect(() => {
        const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < usersList?.length
        setChecked(selectedUsers.length === usersList?.length)
        setIndeterminate(isIndeterminate)
        // checkbox.current.indeterminate = isIndeterminate
    }, [selectedUsers])

    function toggleAll() {
        setSelectedUsers(checked || indeterminate ? [] : usersList)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }

    
    const onChange = async (dates: any, field: any) => {
        let sd = null;
        let ed = null;
        const data = [];
        setChecked(false);
        if (field === 'date') {
            const [start, end] = dates;
            console.log("start ==>", moment(start).unix(), "end==>", moment(end).unix())

            setStartDate(start);
            setEndDate(end);

            console.log("date ==>", dates, "startdate", startDate, "end date", endDate)

            sd = moment(start).unix();
            ed = moment(end).unix()

            for (let i = 0; i < dupVisitors?.length; i++) {
                console.log(dupVisitors)

                if (dupVisitors[i]?.metaInfo?.createdAt > sd && dupVisitors[i]?.metaInfo?.createdAt <= ed && fiterType === 'all') {
                    data.push(dupVisitors[i]);
                    console.log("-->", dupVisitors[i])
                } else if (dupVisitors[i]?.visitorType === fiterType && dupVisitors[i]?.metaInfo?.createdAt > sd && dupVisitors[i]?.metaInfo?.createdAt <= ed) {
                    data.push(dupVisitors[i]);
                }
            }

            await setUsersList(data);
        } else if (field === 'dropdown') {
            await setFilterType(dates)
            console.log("date ==>", dates, "startdate", startDate, "end date", endDate, fiterType)
            for (let i = 0; i < dupVisitors?.length; i++) {

                if (startDate !== null && endDate !== null && dates === 'all') {
                    console.log("all & no null dates")
                    if (dupVisitors[i]?.metaInfo?.createdAt > moment(startDate).unix() && dupVisitors[i]?.metaInfo?.createdAt <= moment(endDate).unix() && dates === 'all') {
                        data.push(dupVisitors[i]);
                    }
                } else if (startDate !== null && endDate !== null && dates !== 'all') {
                    console.log("not all & no null dates", dupVisitors[i], startDate, endDate)
                    if (dupVisitors[i]?.metaInfo?.createdAt > moment(startDate).unix() && dupVisitors[i]?.metaInfo?.createdAt <= moment(endDate).unix() && dupVisitors[i]?.visitorType === dates) {
                        data.push(dupVisitors[i]);
                    }
                } else if (startDate === null && endDate === null && dates === 'all') {
                    console.log(" all &  null dates")
                    data.push(dupVisitors[i]);
                } else if (startDate === null && endDate === null && dates !== 'all') {
                    if (dupVisitors[i]?.visitorType === dates) {
                        console.log("not all &  null dates")
                        data.push(dupVisitors[i]);
                    }
                }
            }

            await setUsersList(data);
        }



    };
    const reset = () => {
        // e.preventDefault();
        setFilterType('all')
        setStartDate(null);
        setEndDate(null);
        setUsersList(resetData)
    }
    return (
        <Layout>
        <div>
            {/* Users */}
            <div className="px-4 sm:px-6 lg:px-8 ">
                <div className='flex items-center justify-between lg:mt-[3vw]'>
                    <div className='flex'>
                        <div className='lg:mr-[3vw] mr-5 flex'>
                            {/* <div className="lg:mr-[5vw] mr-5 flex flex-col" >
                            <label htmlFor="start-date">Start Date:</label>
                            <input type="date" id="start-date" value={startDate} onChange={(e) => handler(e)} />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="end-date">End Date:</label>
                            <input type="date" id="end-date" value={endDate} onChange={(e) => handler(e)} />
                        </div> */}
                            <DatePicker
                                selected={startDate}
                                onChange={(d) => onChange(d, "date")}
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="dd/MM/yyyy"
                                selectsStart
                                placeholderText="Select Range"
                                // excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}
                                selectsRange
                                className='rounded-md w-[17vw]'
                            // inline
                            />
                        </div>
                        {/* <div className="flex flex-col lg:mr-[2vw] mr-5">
                            <select id='visitype' className='rounded-md w-[17vw]' value={fiterType} onChange={(e) => onChange(e.target.value, "dropdown")}>
                                <option value="casual">casual</option>
                                <option value="professional">professional</option>
                                <option value="all">all</option>
                            </select>
                        </div> */}
                        <div>
                            <button className='bg-gray-300 rounded-md outline-none border-none hover:bg-gray-400 px-2 py-2' onClick={reset}>Reset Filters</button>
                        </div>
                    </div>
                    
                </div>
                <div className="mt-5 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="relative">
                                <table className="min-w-full table-fixed divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            {/* <th scope="col" className="relative px-7 sm:w-20 sm:px-6">

                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    ref={checkbox}
                                                    checked={checked}
                                                    onChange={toggleAll}
                                                />
                                            </th> */}
                                            <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Email
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Phone Number
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Create At
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {usersList?.length > 0 ? usersList?.map((user: any) => (
                                            <tr key={user.email} className={selectedUsers.includes(user) ? 'bg-gray-50' : undefined}>
                                                {/* <td className="relative px-7 sm:w-12 sm:px-6">
                                                    {selectedUsers.includes(user) && (
                                                        <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                                    )}
                                                    <input
                                                        type="checkbox"
                                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        value={user.email}
                                                        checked={selectedUsers.includes(user)}
                                                        onChange={(e) =>
                                                            setSelectedUsers(
                                                                e.target.checked
                                                                    ? [...selectedUsers, user]
                                                                    : selectedUsers.filter((p:any) => p !== user)
                                                            )
                                                        }
                                                    />
                                                </td> */}
                                                <td
                                                    className={classNames(
                                                        'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                                                        selectedUsers.includes(user) ? 'text-indigo-600' : 'text-gray-900'
                                                    )}
                                                >
                                                    {user.firstName} {user.lastName}

                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.phoneNumber}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{moment(user.metaInfo.createdAt * 1000).format('DD/MM/YYYY')}</td>
                                            </tr>
                                        )) : 
                                        <tr className='text-[1.7vw] w-full text-center text-gray-500'><td colSpan={5}>No Users</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Layout>
    )
}


// export async function getServerSideProps(context: any) {
//     // let token = localStorage.getItem('token');
//     const localStorageValue = context.req.headers['token'];

//     console.log("t",localStorageValue)
    

//     return {
//         props: { data }
//     }
// }
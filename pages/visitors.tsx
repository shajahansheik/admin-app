let data = [
    {
        "visitorId": "xyz1",
        "email": "a@pro.com",
        "visitorType": "professional",
        "firstVisitedAt": 1684305058,
        "lastVisitedAt": 1684305058,
        "visits": {
            "visitedAt": 1
        }
    },
    {
        "visitorId": "xyz2",
        "email": "a@gmail.com",
        "visitorType": "casual",
        "firstVisitedAt": 1663376458,
        "lastVisitedAt": 1673917258,
        "visits": {
            "visitedAt": 3
        }
    },
    {
        "visitorId": "xyz3",
        "email": "a@yahoo.com",
        "visitorType": "casual",
        "firstVisitedAt": 1658019658,
        "lastVisitedAt": 1684305058,
        "visits": {
            "visitedAt": 6
        }
    }

]

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import handler from './api/hello';
import MailModal from './components/mailModel';
import Layout from './components/layout';
import axios from 'axios';


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Visitors() {
    const [visitorsList, setVisitorsList] = useState<any>()
    const checkbox: any = useRef()
    const [checked, setChecked] = useState<any>(false)
    const [indeterminate, setIndeterminate] = useState<any>(false)
    const [selectedVisitors, setSelectedVisitors] = useState<any>([])
    const [datePicker, setDatePicker] = useState<any>("")
    const [resetData, setResetData] = useState<any>()
    const [fiterType, setFilterType] = useState("all");


    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dupVisitors, setDupVisitors] = useState<any>()

    useEffect(() => {
        let storedValue: any = '';
        // const res = fetch(`https://bondaf-api.azurewebsites.net/users/list`);
        // let data = (res.json());
        if (typeof window !== 'undefined') {
            // Access localStorage here
            storedValue = localStorage.getItem('token');
            console.log(storedValue);
        }
        axios.get(`https://bondaf-api.azurewebsites.net/visitors/list`, {
            headers: {
                'Authorization': `Bearer ${storedValue}`,

            }
        }).then((res: any) => {
            console.log("res", res);
            setVisitorsList(res?.data?.visitors);
            setDupVisitors(res?.data?.visitors);
            setResetData(res?.data?.visitors);
        })
    }, [])

    useEffect(() => {
        if (visitorsList?.length > 0) {
            const isIndeterminate = selectedVisitors.length > 0 && selectedVisitors.length < visitorsList.length
            setChecked(selectedVisitors.length === visitorsList.length)
            setIndeterminate(isIndeterminate)
            checkbox.current.indeterminate = isIndeterminate

        }
    }, [selectedVisitors])

    function toggleAll() {
        setSelectedVisitors(checked || indeterminate ? [] : visitorsList)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }
    console.log("data", visitorsList)





    const onChange = async (dates: any, field: any) => {
        let sd = null;
        let ed = null;
        const data = [];
        setChecked(false);
        setSelectedVisitors([])
        console.log('dupVisitors', dupVisitors)
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

                if (dupVisitors[i]?.firstVisitedAt > sd && dupVisitors[i]?.lastVisitedAt <= ed && fiterType === 'all') {
                    data.push(dupVisitors[i]);
                    console.log("-->", dupVisitors[i])
                } else if (dupVisitors[i]?.visitorType === fiterType && dupVisitors[i]?.firstVisitedAt > sd && dupVisitors[i]?.lastVisitedAt <= ed) {
                    data.push(dupVisitors[i]);
                }
            }

            await setVisitorsList(data);
        } else if (field === 'dropdown') {
            await setFilterType(dates)
            console.log("date ==>", dates, "startdate", startDate, "end date", endDate, fiterType)
            for (let i = 0; i < dupVisitors?.length; i++) {

                if (startDate !== null && endDate !== null && dates === 'all') {
                    console.log("all & no null dates")
                    if (dupVisitors[i]?.firstVisitedAt > moment(startDate).unix() && dupVisitors[i]?.lastVisitedAt <= moment(endDate).unix() && dates === 'all') {
                        data.push(dupVisitors[i]);
                    }
                } else if (startDate !== null && endDate !== null && dates !== 'all') {
                    console.log("not all & no null dates", dupVisitors[i], startDate, endDate)
                    if (dupVisitors[i]?.firstVisitedAt > moment(startDate).unix() && dupVisitors[i]?.lastVisitedAt <= moment(endDate).unix() && dupVisitors[i]?.visitorType === dates) {
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

            await setVisitorsList(data);
        }



    };
    const reset = () => {
        // e.preventDefault();
        setFilterType('all')
        setStartDate(null);
        setEndDate(null);
        setChecked(false);
        setSelectedVisitors([]);
        setVisitorsList(resetData);
    }

    const [open, setOpen] = useState<any>(false)

    return (
        <Layout>
            <div>
                {/* visitors */}
                <div className="px-4 sm:px-6 lg:px-8">
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
                            <div className="flex flex-col lg:mr-[2vw] mr-5">
                                {/* <label htmlFor="visitype">End Date:</label> */}
                                <select id='visitype' className='rounded-md w-[17vw]' value={fiterType} onChange={(e) => onChange(e.target.value, "dropdown")}>
                                    <option value="casual">casual</option>
                                    <option value="professional">professional</option>
                                    <option value="all">all</option>
                                </select>
                            </div>
                            <div>
                                <button className='bg-gray-300 rounded-md outline-none border-none hover:bg-gray-400 px-2 py-2' onClick={reset}>Reset Filters</button>
                            </div>
                        </div>
                        <div className='flex items-center justify-end h-4'>
                            {selectedVisitors?.length > 0 ? <button
                                onClick={() => { setOpen(true); console.log(selectedVisitors) }}
                                type="button"
                                className="block rounded-md bg-[#3399FF] px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#3399ffd1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3399FF]"
                            >
                                Send Mail to {selectedVisitors?.length}
                            </button> : null}
                        </div>
                    </div>
                    {/* <div className='text-[2vw]'>Visitors</div> */}

                    <div className="mt-8 lg:mt-[3vw] flow-root h-[40vw] overflow-scroll">
                        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="relative ">
                                    <table className="min-w-full divide-y relative divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="relative px-7 sm:w-20 sm:px-6">

                                                    <input
                                                        type="checkbox"
                                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-[#3399FF] focus:ring-[#3399FF]"
                                                        ref={checkbox}
                                                        checked={checked}
                                                        onChange={toggleAll}
                                                    />
                                                    {/* <label>All</label> */}
                                                </th>
                                                <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Type
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    First Visits
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Last Visits
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 relative">
                                            {visitorsList?.length > 0 ? visitorsList?.map((visitor: any, index: number) => (
                                                <tr key={index} className={selectedVisitors.includes(visitor) ? 'bg-gray-50 ' : undefined}>
                                                    <td className="relative px-7 sm:w-12 sm:px-6">
                                                        {selectedVisitors.includes(visitor) && (
                                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-[#3399FF]" />
                                                        )}
                                                        <input
                                                            type="checkbox"
                                                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-[#3399FF] focus:ring-[#3399FF]"
                                                            value={visitor.email}
                                                            checked={selectedVisitors.includes(visitor)}
                                                            onChange={(e) =>
                                                                setSelectedVisitors(
                                                                    e.target.checked
                                                                        ? [...selectedVisitors, visitor]
                                                                        : selectedVisitors.filter((p: any) => p !== visitor)
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td
                                                        className={classNames(
                                                            'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                                                            selectedVisitors.includes(visitor) ? 'text-[#3399FF]' : 'text-gray-900'
                                                        )}
                                                    >
                                                        {visitor.email}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{visitor.visitorType}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{moment(visitor.firstVisitedAt * 1000).format('DD/MM/YYYY')}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{moment(visitor.lastVisitedAt * 1000).format('DD/MM/YYYY')}</td>
                                                </tr>
                                            )) : <tr className='text-[1.7vw] w-full text-center text-gray-500'><td colSpan={5}>No Visiters List</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div>
                    <MailModal open={open} setOpen={setOpen} selectedVisitors={selectedVisitors} setSelectedVisitors={setSelectedVisitors} setChecked={setChecked} />
                </div>
            </div>
        </Layout>
    )
}

// export async function getServerSideProps(context: any) {
//     const res = await fetch(`https://bondaf-api.azurewebsites.net/visitors/list`);
//     let data = (await res.json());


//     return {
//         props: { data }
//     }
// }


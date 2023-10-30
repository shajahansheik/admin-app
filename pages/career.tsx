import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import moment from "moment";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Layout from "./components/layout";
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
});


const tabs = [
    { name: 'Careers' },
    { name: 'Applicants' },
    { name: 'New Career' }
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Career(data: any) {
    const [currentEl, setCurrentEl] = useState<any>('Careers');
    const [isNewCarrer, setIsNewCareer] = useState("");
    const [role, setRole] = useState<any>("");
    const [description, setDescription] = useState("");
    const [adminData, setAdminData] = useState<any>();

    const [careerList, setCareerList] = useState<any>()
    const [applicationsList, setApplicationsList] = useState<any>()
    console.log("careers", data, applicationsList)
    const handleEditorChange = (value: any) => {
        setDescription(value);
        // console.log(value)
    };


    useEffect(() => {
        let storedValue: any = '';

        if (typeof window !== 'undefined') {
            storedValue = localStorage.getItem('token');
            console.log(storedValue);
        }
        axios.get(`https://bondaf-api.azurewebsites.net/career/roles/list`, {
            headers: {
                'Authorization': `Bearer ${storedValue}`,

            }
        }).then((res: any) => {
            console.log("res", res);
            setCareerList(res?.data?.careerRoles)
        })

        axios.get(`https://bondaf-api.azurewebsites.net/applications/list`, {
            headers: {
                'Authorization': `Bearer ${storedValue}`,

            }
        }).then((res: any) => {
            console.log("res", res);
            let admin = localStorage.getItem("admin");
            setAdminData(admin);
            setApplicationsList(res?.data?.application)
        })
    }, [])



    const saveCareer = async () => {
        console.log("career", description, role)
        let options = {
            "careerRole": role,
            "description": description,
        }
        let storedValue: any = '';

        if (typeof window !== 'undefined') {
            storedValue = localStorage.getItem('token');
            console.log(storedValue);
        }
        await axios.post(`https://bondaf-api.azurewebsites.net/career/roles/add`, options, {
            headers: {
                'Authorization': `Bearer ${storedValue}`,

            }
        }).then(async (res: any) => {
            console.log("career posting ", res)
            if (res) {
                await axios.get(`https://bondaf-api.azurewebsites.net/career/roles/list`, {
                    headers: {
                        'Authorization': `Bearer ${storedValue}`,

                    }
                }).then((response: any) => {
                    console.log("res", response);
                    setCareerList(response?.data?.careerRoles)
                    setRole("");
                    setDescription("");
                    setIsNewCareer("")
                    setCurrentEl("Careers");
                })
            }
        })
    }


    const deleteCareer = async (career: any) => {
        let options = {
            "careerRoleId": career?.careerRoleId,
            "isDeleted": true
        }
        let storedValue: any = '';

        if (typeof window !== 'undefined') {
            storedValue = localStorage.getItem('token');
            console.log(storedValue);
        }
        await axios.post(`https://bondaf-api.azurewebsites.net/career/roles/add`, options, {
            headers: {
                'Authorization': `Bearer ${storedValue}`,

            }
        }).then(async (res: any) => {
            console.log("career posting ", res)
            if (res) {
                await axios.get(`https://bondaf-api.azurewebsites.net/career/roles/list`, {
                    headers: {
                        'Authorization': `Bearer ${storedValue}`,

                    }
                }).then((response: any) => {
                    console.log("res", response);
                    // alert("career Deleted")
                    setCareerList(response?.data?.careerRoles)
                    setRole("");
                    setDescription("");
                    setIsNewCareer("")
                    setCurrentEl("Careers");
                })
            }
        })
    }

    const [open, setOpen] = useState(false);
    const [openApp, setOpenApp] = useState(false);
    const [dialogCareeer, setDialogCareer] = useState<any>();
    const [dialogCareeerApp, setDialogCareerApp] = useState<any>();
    const [pdfUrl, setPdfUrl] = useState<any>('')
    const openDialog = (career: any) => {
        setDialogCareer(career);
        setOpen(true);
    }
    const openAppDialog = (career: any) => {
        career['adminDetails'] = JSON.parse(adminData);
        axios.post('http://localhost:4000/api/getVisitors', career, { responseType: 'blob' }).then(res => {
            // setUserData(initialDetails);
            // Router.push('/')
            console.log("result", res)
            const file = new Blob(
                [res.data],
                { type: 'application/pdf' }
            );
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            console.log(fileURL);
            setPdfUrl(fileURL);
            // window.open(fileURL, '_blank');
            setDialogCareerApp(career);
            setOpenApp(true);
        })
    }
    console.log("admin", adminData)
    return (
        <Layout>
            <div className="my-10 ">
                <div className="border-b border-gray-200 pb-5 sm:pb-0 px-3">
                    <div className="flex items-center justify-end h-[2vw]">
                        {/* <h3 className="text-[2vw] font-semibold leading-6 text-gray-900">Career</h3> */}
                        <div className="ml-4  flex-shrink-0">
                            {!isNewCarrer ? <button
                                type="button"
                                onClick={() => { setIsNewCareer("New Career"); setCurrentEl("New Career") }}
                                className="relative inline-flex items-center rounded-md bg-[#3399FF] px-3 py-2 text-[1.1vw] font-semibold text-white shadow-sm hover:bg-[#3399ffd0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Create new job
                            </button> : null}
                        </div>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <div >
                            <nav className="-mb-px flex space-x-8">

                                <div

                                    onClick={() => setCurrentEl("Careers")}
                                    className={classNames(
                                        currentEl == "Careers"
                                            ? 'border-[#3399ffd8] text-[#3399FF]'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'whitespace-nowrap border-b-2 px-1 hover:cursor-pointer pb-4 text-[1.2vw] font-medium'
                                    )}

                                >
                                    Careers
                                </div>
                                <div

                                    onClick={() => setCurrentEl("Applicants")}
                                    className={classNames(
                                        currentEl == "Applicants"
                                            ? 'border-[#3399ffd8] text-[#3399FF]'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'whitespace-nowrap border-b-2 px-1 hover:cursor-pointer pb-4 text-[1.2vw] font-medium'
                                    )}

                                >
                                    Applicants
                                </div>
                                {isNewCarrer == "New Career" ?
                                    <div className={classNames(
                                        currentEl == "New Career"
                                            ? 'border-[#3399ffd8] text-[#3399FF]'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'whitespace-nowrap border-b-2 pb-4 px-1 hover:cursor-pointer text-[1.2vw] font-medium flex'
                                    )}>
                                        <div

                                            onClick={() => setCurrentEl("New Career")}


                                        >
                                            New Career &nbsp; </div>
                                        <span className="flex items-center hover:cursor-pointer" onClick={() => { setCurrentEl("Careers"); setIsNewCareer(""); }}>
                                            <svg fill="#ff0000" width="1.3vw" height="1.3vw" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4.293,18.293,10.586,12,4.293,5.707A1,1,0,0,1,5.707,4.293L12,10.586l6.293-6.293a1,1,0,1,1,1.414,1.414L13.414,12l6.293,6.293a1,1,0,1,1-1.414,1.414L12,13.414,5.707,19.707a1,1,0,0,1-1.414-1.414Z"></path></g></svg>
                                        </span>
                                    </div>

                                    : null}

                            </nav>
                        </div>
                    </div>

                </div>
                <div className="px-3">
                    {
                        currentEl === "Careers" ? <div className="border divide-y mt-3">
                            <div className='grid grid-cols-5 px-2 py-4 text-[1.2vw] font-semibold'>
                                <div>Created At</div>
                                <div>Career Role</div>
                                <div className="col-span-2">Description</div>
                            </div>
                            <div>
                                {
                                    careerList?.map((career: any, index: number) => (
                                        <div key={index} className='grid grid-cols-5 px-2 py-4 capitalize'>
                                            <div>
                                                {moment(career?.metaInfo?.createdAt * 1000).format('DD-MM-YYYY')}
                                            </div>
                                            <div>
                                                {career?.careerRole}
                                            </div>
                                            <div className="col-span-2 flex items-center space-x-4">
                                                <GetHtml html={career?.description} />
                                                {/* <div className="truncate w-1/2" dangerouslySetInnerHTML={{ __html: career?.description }}> </div> */}
                                            </div>
                                            <div className="space-x-4 text-right">
                                                <button onClick={() => openDialog(career)} className="text-[#3399FF] text-[0.9vw]">Read more</button>
                                                <button onClick={() => deleteCareer(career)} className="text-[red] text-[0.9vw]">Delete</button>

                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        </div> : null
                    }
                    {
                        currentEl === "Applicants" ? <div className="border divide-y mt-3">
                            <div className='grid grid-cols-4 px-2 py-4 text-[1.2vw] font-semibold'>
                                <div>Created At</div>
                                <div>Email</div>
                                <div>Career Role</div>
                            </div>
                            <div>
                                {
                                    applicationsList?.map((career: any, index: number) => (
                                        <div key={index} className='grid grid-cols-4 px-2 py-4 capitalize'>
                                            <div>
                                                {moment(career?.metaInfo?.createdAt * 1000).format('DD-MM-YYYY')}
                                            </div>
                                            <div>
                                                {career?.userDetails?.email}
                                            </div>
                                            <div>
                                                {career?.careerRoleInfo?.careerRole}
                                            </div>
                                            <div className="space-x-4 text-right">
                                                <button onClick={() => openAppDialog(career)} className="text-[#3399FF] text-[0.9vw]">Read more</button>
                                                {/* <button onClick={() => deleteCareer(career)} className="text-[red] text-[0.9vw]">Delete</button> */}

                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        </div> : null
                    }
                    {
                        currentEl === "New Career" ? <div>
                            <div>
                                <div className="relative">
                                    <div className="mt-[1vw]">
                                        <input type='text' onChange={(e) => setRole(e.target.value)} value={role} placeholder="Add Job Role" name="job_role" className="border-2 px-2 focus:outline-none h-[3vw] text-[1vw] rounded-lg w-full" />
                                    </div>
                                    <div className="mt-[1vw] h-[28vw]">
                                        <ReactQuill
                                            value={description}
                                            onChange={handleEditorChange}
                                            modules={{
                                                toolbar: [
                                                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                                    ["bold", "italic", "underline", "strike", "blockquote"],
                                                    [{ list: "ordered" }, { list: "bullet" }],
                                                    // ["link", "image", "video"],
                                                    ["clean"],
                                                ],
                                            }}
                                            style={{ height: "25vw" }}
                                            placeholder="Write something amazing..."
                                        />
                                    </div>
                                    <div className="mt-[1vw] flex items-center justify-end" >
                                        <button onClick={() => saveCareer()} className='hover:shadow bg-[#3399FF] px-5 py-1.5 text-white rounded-md'>Add</button>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }
                </div>

                {/* application view */}
                <div>
                    <Transition.Root show={openApp} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={setOpenApp}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-[80vw] h-[50vw] sm:p-6">
                                            <div className=" ">
                                                <div className="flex items-center justify-between mb-[1vw] p-[0.5vw]">
                                                    <span className="text-[1.6vw] capitalize font-semibold text-[#3399FF]">{dialogCareeerApp?.careerRoleInfo?.careerRole}</span>
                                                    <div className="flex space-x-2">
                                                        <span>Created At :</span>
                                                        <span className="text-[1.2vw] font-semibold">{moment(dialogCareeerApp?.metaInfo?.createdAt * 1000).format('DD-MM-YYYY')}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <iframe src={pdfUrl} title="W3Schools Free Online Web Tutorials" className="w-[76vw] h-[35vw] relative overflow-scroll"></iframe>

                                                </div>
                                                {/* <div className="w-[76vw] h-[40vw] relative overflow-scroll" >
                                                    <div className="space-y-5">
                                                        {((dialogCareeerApp?.softSkills?.length > 0 && dialogCareeerApp?.softSkills[0]?.skill !== '') || (dialogCareeerApp?.toKnowYourSelft?.length > 0 && dialogCareeerApp?.toKnowYourSelft[0] !== '') || (dialogCareeerApp?.languages?.length > 0 && dialogCareeerApp?.languages[0]?.language !== '')) ?
                                                            <div className="space-y-5">
                                                                <div className="bg-gray-200   text-center text-xl lg:text-[1.4vw] font-semibold p-[0.7vw]">Compétences clés</div>
                                                                {dialogCareeerApp?.softSkills?.length > 0 && dialogCareeerApp?.softSkills[0]?.skill !== '' ? <div className="border-2 border-black">
                                                                    <div className="bg-gray-300 border-b-2 border-black  text-center text-lg lg:text-[1.3vw] font-semibold p-[0.7vw]">SAVOIR FAIRE &amp; OUTILS</div>
                                                                    <div >
                                                                        <div className="grid grid-cols-3 border-b-2 border-black text-center">
                                                                            <span className=" col-span-2 text-base lg:text-[1.2vw] font-semibold p-[0.7vw]">Compétences</span>
                                                                            <span className="border-l-2 border-black  text-base lg:text-[1.2vw] font-semibold p-[0.7vw]">Autonome</span>
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                dialogCareeerApp?.softSkills?.map((skill: any, index: number) => (
                                                                                    <div key={index} className={dialogCareeerApp?.softSkills?.length - 1 === index ? "grid grid-cols-3 text-center" : "grid grid-cols-3 border-b-2 border-black text-center"}>
                                                                                        <span className="p-[0.7vw] col-span-2 text-sm lg:text-[1.1vw]">{skill?.skill}</span>
                                                                                        <span className="border-l-2 border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{skill?.level}</span>

                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div> : null}
                                                                {dialogCareeerApp?.toKnowYourSelft?.length > 0 && dialogCareeerApp?.toKnowYourSelft[0] !== '' ? <div className="border-2 border-black">
                                                                    <div className="bg-gray-300 border-b-2 border-black p-[0.7vw] text-center text-lg lg:text-[1.3vw] font-semibold">SAVOIR ÊTRE</div>
                                                                    <div >
                                                                        <div className=" border-b-2 border-black p-[0.7vw]  text-base lg:text-[1.2vw] font-semibold">
                                                                            Courageous
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                dialogCareeerApp?.toKnowYourSelft?.map((know: any, index: number) => (
                                                                                    <div key={index} className={dialogCareeerApp?.toKnowYourSelft?.length - 1 === index ? "p-[0.7vw] text-sm lg:text-[1.1vw]" : "p-[0.7vw] border-b-2 border-black text-sm lg:text-[1.1vw]"}>
                                                                                        {know}
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div> : null}
                                                                {dialogCareeerApp?.languages?.length > 0 && dialogCareeerApp?.languages[0]?.language !== '' ? <div className="border-2 border-black">
                                                                    <div className="bg-gray-300 border-b-2 border-black p-[0.7vw] text-center text-lg lg:text-[1.3vw] font-semibold">LANGUES</div>
                                                                    <div >
                                                                        <div className="grid grid-cols-2 border-b-2 border-black text-center">
                                                                            <span className="p-[0.7vw]  text-base lg:text-[1.2vw] font-semibold">Anglais</span>
                                                                            <span className="border-l-2 border-black p-[0.7vw] text-base lg:text-[1.2vw] font-semibold">Courant/Bilingue</span>
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                dialogCareeerApp?.languages?.map((language: any, index: number) => (
                                                                                    <div key={index} className={dialogCareeerApp?.languages?.length - 1 === index ? "grid grid-cols-2 text-center" : "grid grid-cols-2 border-b-2 border-black text-center"}>
                                                                                        <span className="p-[0.7vw] text-sm lg:text-[1.1vw] ">{language?.language}</span>
                                                                                        <span className="border-l-2 border-black p-[0.7vw] text-sm lg:text-[1.1vw]" >{language?.level}</span>

                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div> : null}
                                                            </div> : null}
                                                        {dialogCareeerApp?.education?.length > 0 && dialogCareeerApp?.education[0]?.education !== '' ? <div className="space-y-5">
                                                            <div className="bg-gray-200  p-[0.7vw] text-center text-xl lg:text-[1.4vw] font-semibold">Education</div>

                                                            <div className="border-2 border-black">
                                                                <div className="bg-gray-300 border-b-2 border-black p-[0.7vw] text-center text-lg lg:text-[1.3vw] font-semibold">DIPLÔME(S)</div>
                                                                <div >
                                                                    <div className="grid grid-cols-3 border-b-2 border-black text-center">
                                                                        <span className="p-[0.7vw]  text-base lg:text-[1.2vw] font-semibold">À</span>
                                                                        <span className="border-l-2 border-black p-[0.7vw] text-base lg:text-[1.2vw] font-semibold col-span-2">Diplôme</span>
                                                                    </div>
                                                                    <div>
                                                                        {
                                                                            dialogCareeerApp?.education?.map((diploma: any, index: number) => (
                                                                                <div key={index} className={dialogCareeerApp?.education?.length - 1 === index ? "grid grid-cols-3 text-center" : "grid grid-cols-3 border-b-2 border-black text-center"}>
                                                                                    <span className="p-[0.7vw] text-sm lg:text-[1.1vw]">{diploma?.to}</span>
                                                                                    <span className="border-l-2 border-black p-[0.7vw] col-span-2 text-sm lg:text-[1.1vw]">{diploma?.education}</span>

                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> : null}
                                                        {dialogCareeerApp?.internships?.length > 0 && dialogCareeerApp?.internships[0]?.internship !== '' ? <div className="space-y-5">
                                                            <div className="bg-gray-200  p-[0.7vw] text-center text-xl lg:text-[1.4vw] font-semibold">Formation(s)</div>

                                                            <div className="border-2 border-black">
                                                                <div className="bg-gray-300 border-b-2 border-black p-[0.7vw] text-center text-lg lg:text-[1.3vw] font-semibold">Internship(s)</div>
                                                                <div >
                                                                    <div className="grid grid-cols-3 border-b-2 border-black text-center">
                                                                        <span className="p-[0.7vw]  text-base lg:text-[1.2vw] font-semibold">À</span>
                                                                        <span className="border-l-2 border-black p-[0.7vw] text-base lg:text-[1.2vw] font-semibold col-span-2">Internship(s)</span>
                                                                    </div>
                                                                    <div>
                                                                        {
                                                                            dialogCareeerApp?.internships?.map((intern: any, index: number) => (
                                                                                <div key={index} className={dialogCareeerApp?.internships?.length - 1 === index ? "grid grid-cols-3 text-center" : "grid grid-cols-3 border-b-2 border-black text-center"}>
                                                                                    <span className="p-[0.7vw] text-sm lg:text-[1.1vw]">{intern?.to}</span>
                                                                                    <span className="border-l-2 border-black p-[0.7vw] col-span-2 text-sm lg:text-[1.1vw]">{intern?.internship}</span>

                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> : null}
                                                        {dialogCareeerApp?.experience?.length > 0 ? <div className="space-y-5">

                                                            <div className="bg-gray-200  p-[0.7vw] text-center text-xl lg:text-[1.4vw] font-semibold">Expérience Professionnelle</div>

                                                            <div className="">
                                                                {
                                                                    dialogCareeerApp?.experience?.map((exp: any, index: number) => (
                                                                        <div key={index} >
                                                                            <div className="grid grid-cols-3">
                                                                                <div className="border-t-2 border-l-2 border-r-2 border-black p-[0.7vw] space-y-2 lg:text-[1.1vw] font-semibold">
                                                                                    <div className="">
                                                                                        <span>Durée</span>
                                                                                        <span className="">{exp?.duration}</span>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2">

                                                                                        <span>À : &nbsp; {exp?.to}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div >
                                                                                    <span></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="border-black border-2">
                                                                                <div className="grid grid-cols-3 ">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">SOCIÉTÉ</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.companyName ? exp?.companyName : '-'}</span>
                                                                                </div>
                                                                                <div className="grid grid-cols-3 border-t-2 border-black">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">Secteur d’activité</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.activity_area ? exp?.activity_area : '-'}</span>
                                                                                </div>
                                                                                <div className="grid grid-cols-3 border-t-2 border-black">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">Poste</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.jobTitle ? exp?.jobTitle : '-'}</span>
                                                                                </div>
                                                                                <div className="grid grid-cols-3 border-t-2 border-black">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">Titre &amp; Objectif(s) de la mission</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.projectObjective ? exp?.projectObjective : '-'}</span>
                                                                                </div>
                                                                                <div className="grid grid-cols-3 border-t-2 border-black">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">Activités réalisées</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.accomplishments ? exp?.accomplishments : '-'}</span>
                                                                                </div>
                                                                                {exp?.programmingLanguagesUsed ? <div className="grid grid-cols-3 border-t-2 border-black">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">Langages de programmation</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.programmingLanguagesUsed}</span>
                                                                                </div> : null}
                                                                                {exp?.softwareToolsUsed ? <div className="grid grid-cols-3 border-t-2 border-black">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">Logiciels / Outils utilisés</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.softwareToolsUsed}</span>
                                                                                </div> : null}
                                                                                {exp?.operatingSystem ? <div className="grid grid-cols-3 border-t-2 border-black">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">Système d’exploitation</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.operatingSystem ? exp?.operatingSystem : "-"}</span>
                                                                                </div> : null}
                                                                                <div className="grid grid-cols-3 border-t-2 border-black">
                                                                                    <span className="p-[0.7vw] border-r-2 border-black text-sm lg:text-[1.1vw] font-semibold ">Référence(s) entreprise</span>
                                                                                    <span className="col-span-2  border-black p-[0.7vw] text-sm lg:text-[1.1vw]">{exp?.reference ? exp?.reference : '-'}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div> : null}
                                                    </div>

                                                </div> */}
                                            </div>
                                            <div className="flex h-[5vw] items-end justify-end">
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                    onClick={() => setOpenApp(false)}

                                                >
                                                    close
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </div>


                {/* career view */}
                <div>
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={setOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-[60vw] h-[40vw] sm:p-6">
                                            <div className=" ">
                                                <div className="flex items-center justify-between mb-[1vw]">
                                                    <span className="text-[1.4vw] capitalize font-semibold text-[#3399FF]">{dialogCareeer?.careerRole}</span>
                                                    <div className="flex space-x-2">
                                                        <span>Created At :</span>
                                                        <span className="text-[1.2vw] font-semibold">{moment(dialogCareeer?.metaInfo?.createdAt * 1000).format('DD-MM-YYYY')}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 h-[30vw] relative overflow-scroll" dangerouslySetInnerHTML={{ __html: dialogCareeer?.description }}>
                                                    {/* <GetHtml html={dialogCareeer?.description} /> */}
                                                </div>
                                            </div>
                                            <div className="flex h-[5vw] items-end justify-end">
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                    onClick={() => setOpen(false)}

                                                >
                                                    close
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </div>
            </div>
        </Layout>
    )
}
// export async function getServerSideProps(context: any) {
//     const res = await fetch(`https://bondaf-api.azurewebsites.net/career/roles/list`);
//     let data = (await res.json());

//     const res1 = await fetch(`https://bondaf-api.azurewebsites.net/applications/list`);
//     let data1 = (await res1.json());

//     return {
//         props: { career: data, applications: data1 }
//     }
// }



const GetHtml = (props: any) => {
    console.log(props)
    return <div className="aboutParaService1" dangerouslySetInnerHTML={{ __html: props?.html }}></div>
}
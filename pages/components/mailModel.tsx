import dynamic from "next/dynamic";
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
});

function MailModal(pageProps: any) {
    console.log("pag===>", pageProps)
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");
    const handleEditorChange = (value: any) => {
        setDescription(value);
        // console.log(value)
    };
    const sendMail = () => {
        let mailData = [];
        for (let i = 0; i < pageProps?.selectedVisitors?.length; i++) {
            let obj = {
                emailTo: pageProps?.selectedVisitors[i]?.email,
                subject: subject,
                templateData: description,
                attachments: []
            }
            mailData.push(obj)
        }
        console.log("mail data", mailData)
        axios.post(`https://bondaf-api.azurewebsites.net/communication/mail/bulk/send`, mailData).then((res: any) => {
            console.log("res==>", res)
            toast.success(`${res?.data?.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setDescription("");
            pageProps?.setChecked(false);
            setSubject("");
            pageProps?.setSelectedVisitors([]);
            pageProps?.setOpen(false);
        }).catch((err) => {
            toast.success(`${err?.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        })
    }
    return (
        <>
            <ToastContainer />
            <Transition.Root show={pageProps?.open || false} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={pageProps?.setOpen}>
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
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-[60vw] h-[45vw] sm:p-6">
                                    <div className="relative">
                                        <div>
                                            <b> Mail To :</b> <div className='w-full overflow-scroll flex h-[2.8vw] '>{pageProps?.selectedVisitors?.map((v: any, idx: number) => (<div key={idx} className='bg-gray-300 rounded-lg mr-[0.5vw] h-[2vw] flex items-center justify-center px-[0.5vw] py-[0.1vw]'>{v?.email}</div>))}</div>
                                        </div>
                                        <div className="mt-[1vw]">
                                            <input type='text' onChange={(e) => setSubject(e.target.value)} value={subject} placeholder="Subject" name="subject" className="border-2 px-2 focus:outline-none h-[3vw] text-[1vw] rounded-lg w-full" />
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
                                                        // ["clean"],
                                                    ],
                                                }}
                                                style={{ height: "25vw" }}
                                                placeholder="Write something amazing..."
                                            />
                                        </div>

                                    </div>
                                    <div className=" flex justify-end">
                                        <div className="mt-5 sm:mt-6 flex justify-between w-[20vw]">
                                            <button
                                                type="button"
                                                className="inline-flex mr-[1vw] w-full justify-center rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
                                                onClick={() => { setDescription(""); pageProps?.setSelectedVisitors([]); setSubject(""); pageProps?.setChecked(false); pageProps?.setOpen(false); }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-[#3399FF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3399ffc9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3399FF]"
                                                onClick={() => sendMail()}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default MailModal;
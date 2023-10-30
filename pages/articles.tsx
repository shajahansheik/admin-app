
import { useState } from "react"
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import Layout from "./components/layout";

const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
});


const tabs = [
    { name: 'Articles' },
    { name: 'Applicants' },
    { name: 'New Article' }
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Career() {
    const [currentEl, setCurrentEl] = useState<any>('Articles');
    const [isNewCarrer, setIsNewCareer] = useState("");
    const [role, setRole] = useState<any>("");
    const [description, setDescription] = useState("");

    const [articleDetails, setArticleDetails] = useState<any>({
        title: "",
        author: ""
    })
    const [editorValue, setEditorValue] = useState("");

    const handleEditorChange = (value: any) => {
        //   setEditorValue(value);
        console.log(value)
    };

    const save = () => {
        let options = {
            authorName: articleDetails.author,
            title: articleDetails.title,
            content: editorValue
        }
        console.log("data", editorValue, articleDetails, options)
    }
    return (
        <Layout>
        <div className="mx-10 my-5 ">
            Article Page (Loding....)
            {/* <div className="border-b border-gray-200 pb-5 sm:pb-0 ">
                <div className="flex items-center justify-end h-[2vw]">
                    <div className="ml-4  flex-shrink-0">
                        {!isNewCarrer ? <button
                            type="button"
                            onClick={() => { setIsNewCareer("New Article"); setCurrentEl("New Article") }}
                            className="relative inline-flex items-center rounded-md bg-[#3399FF] px-3 py-2 text-[1.1vw] font-semibold text-white shadow-sm hover:bg-[#3399ffd0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Create New
                        </button> : null}
                    </div>
                </div>
                <div className="mt-3 sm:mt-4">
                    <div >
                        <nav className="-mb-px flex space-x-8">

                            <div

                                onClick={() => setCurrentEl("Articles")}
                                className={classNames(
                                    currentEl == "Articles"
                                        ? 'border-[#3399ffd8] text-[#3399FF]'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'whitespace-nowrap border-b-2 px-1 hover:cursor-pointer pb-4 text-[1.2vw] font-medium'
                                )}

                            >
                                Articles
                            </div>

                            {isNewCarrer == "New Article" ?
                                <div className={classNames(
                                    currentEl == "New Article"
                                        ? 'border-[#3399ffd8] text-[#3399FF]'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'whitespace-nowrap border-b-2 pb-4 px-1 hover:cursor-pointer text-[1.2vw] font-medium flex'
                                )}>
                                    <div

                                        onClick={() => setCurrentEl("New Article")}


                                    >
                                        New Article &nbsp; </div>
                                    <span className="flex items-center hover:cursor-pointer" onClick={() => { setCurrentEl("Articles"); setIsNewCareer(""); }}>
                                        <svg fill="#ff0000" width="1.3vw" height="1.3vw" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4.293,18.293,10.586,12,4.293,5.707A1,1,0,0,1,5.707,4.293L12,10.586l6.293-6.293a1,1,0,1,1,1.414,1.414L13.414,12l6.293,6.293a1,1,0,1,1-1.414,1.414L12,13.414,5.707,19.707a1,1,0,0,1-1.414-1.414Z"></path></g></svg>
                                    </span>
                                </div>

                                : null}

                        </nav>
                    </div>
                </div>

            </div>
            <div>
                {
                    currentEl === "Articles" ? <div>hi</div> : null
                }

                {
                    currentEl === "New Article" ? <div className="h-[50vw]  overflow-scroll">
                        <div className="space-y-3 px-10 pt-5">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <input type='text' onChange={(e) => setArticleDetails({ ...articleDetails, title: e.target.value })} value={articleDetails.title} placeholder="Enter Article Name" name="title" className="border-2 px-2 outline-none focus:outline-none h-[3vw] text-[1vw] rounded-lg w-full" />
                                </div>

                                <div>
                                    <input type='text' onChange={(e) => setArticleDetails({ ...articleDetails, author: e.target.value })} value={articleDetails.author} placeholder="Author Name" name="author" className="border-2 px-2 outline-none focus:outline-none h-[3vw] text-[1vw] rounded-lg w-full" />
                                </div>
                            </div>
                            {editorValue}

                            <div style={{ padding: "20px 0px" }}>

                                <ReactQuill
                                    value={editorValue}
                                    onChange={handleEditorChange}
                                    modules={{
                                        toolbar: [
                                            [{ header: [1, 2, 3, 4, false] }],
                                            ["bold", "italic", "underline", "strike", "blockquote"],
                                            [{ list: "ordered" }, { list: "bullet" }],
                                            ["link", "image", "video"],
                                            ["clean"],
                                        ],
                                    }}
                                    style={{ height: "30vw" }}
                                    placeholder="Write something amazing..."
                                />
                            </div>



                        </div>
                    </div> : null
                }
            </div> */}
        </div>
        </Layout>
    )
}

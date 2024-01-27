import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
import { useEffect, useState } from "react";
import Login from "@/components/Login";
import Modal from "react-modal";
import Component from "@/components/Component";

const inter = Inter({ subsets: ["latin"] });

interface Code {
  id: string;
  html: string;
  css: string;
  js: string;
}

export default function Home() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [allComps, setAllComps] = useState<Code[]>([]);
  const [selectedCodeIndex, setSelectedCodeIndex] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([
    "navbar",
    "footer",
    "card",
    "slider",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const customModalStyles = {
    content: {
      backgroundColor: "black",
      color: "white",
      padding: "20px",
      maxWidth: "80%", // Adjust the maximum width as needed
      margin: "auto",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the transparency if needed
    },
  };
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message = "Your data may be lost!";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // useEffect(() => {
  //   axios
  //     .post("api/hello")
  //     .then(function (response: any) {
  //       const { components } = response.data;
  //       // setAllComps(components);
  //       setAllComps(components);

  //       // setCodes(components);
  //     })
  //     .catch(function (error: any) {
  //       console.log(error);
  //     });
  // }, []);

  const fetchComponentsByCategory = (index: number) => {
    // Fetch components based on the selected category
    console.log(categories[index]);
    const data = { catagory: categories[index] };
    axios
      .post("api/crud/read_component", data)
      .then(function (response: any) {
        const { components } = response.data;
        setAllComps(components);
        setSelectedCategory(categories[index]);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  const openModal = (index: number) => {
    setSelectedCodeIndex(index);
    fetchComponentsByCategory(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // console.log(codes);

  return (
    <main className={`${inter.className}`}>
      <div className="w-full flex justify-center mt-5">
        <Login />
      </div>
      <div className="flex justify-center">
        <button onClick={() => setIsModalOpen(true)} className="text-4xl">
          {isModalOpen ? "✘" : "+"}
        </button>
      </div>
      <Component components={codes} />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <div className="flex flex-wrap">
          {categories.map((category, index) => (
            <div
              key={index}
              className="my-5 bg-blue-500 p-5 mx-2 cursor-pointer"
              onClick={() => openModal(index)}
            >
              {category}
            </div>
          ))}
        </div>

        {/* Display components based on the selected category */}
        {selectedCategory && (
          <>
            <div className="text-white mb-3">
              Components under selected category:
            </div>
            {allComps.map((code, index) => (
              <div key={index} className="my-5 bg-blue-500 p-5">
                <div
                  className="homeDiv"
                  dangerouslySetInnerHTML={{
                    __html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${code.css}</style></head><body>${code.html}</body><script>${code.js}</script></html>`,
                  }}
                  onClick={() => {
                    setCodes((prevCode) => {
                      return [...prevCode, code];
                    });
                  }}
                ></div>
              </div>
            ))}
          </>
        )}
        <button onClick={closeModal} className="p-2 bg-red-500">
          Close Button
        </button>
      </Modal>
    </main>
  );
}

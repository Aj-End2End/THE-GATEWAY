import React from "react";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { FaWpforms } from "react-icons/fa";
import FormModal from "./FormModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const images = [
  "images/BANNER/1.jpg",
  "images/BANNER/2.jpg",
  "images/BANNER/3.jpg",
];

const data = [
  {
    type: "3 BHK (Sea View)",
    area: "1262",
    price: "6.25 Cr* ++",
  },
  {
    type: "3 BHK (Sea View)",
    area: "1445",
    price: "8.00 Cr* ++",
  },
  {
    type: "4 BHK (Sea View)",
    area: "1980",
    price: "10.70 Cr* ++",
  },
  {
    type: "4.5 BHK (Sea View)",
    area: "2251",
    price: "11.60 Cr* ++",
  },
];

const galleryImages = [
  "images/GALLERY/THE GATEWAY - GALLERY 1.jpg",
  "images/GALLERY/THE GATEWAY - GALLERY 2.jpg",
  "images/GALLERY/THE GATEWAY - GALLERY 3.jpg",
  "images/GALLERY/THE GATEWAY - GALLERY 4.jpg",
  "images/GALLERY/THE GATEWAY - GALLERY 5.jpg",
  "images/GALLERY/THE GATEWAY - GALLERY 6.jpg",
  "images/GALLERY/THE GATEWAY - GALLERY 7.jpg",
  "images/GALLERY/GALLERY.jpg",
];

const floorImages = [
  "images/FLOOR PLANS/4.jpg",
  "images/FLOOR PLANS/2.jpg",
  "images/FLOOR PLANS/3.jpg",
  "images/FLOOR PLANS/1.jpg",
];

const aminitiesImages = [
  {
    src: "images/AMENITIES/THE GATEWAY - AMENITIES 1.jpg",
    label: "Swimming Pool",
    alt: "the gateway swimming pool"
  },
  {
    src: "images/AMENITIES/THE GATEWAY - AMENITIES 2.jpg",
    label: "Kid's Play Area",
    alt: "the gateway aminities"
  },
  {
    src: "images/AMENITIES/THE GATEWAY - AMENITIES 3.jpg",
    label: "Club House",
    alt: "gateway clubhous"
  },
  {
    src: "images/AMENITIES/THE GATEWAY - AMENITIES 4.jpg",
    label: "Multipurpose Court",
    alt: "getway project sport arena"
  },
  {
    src: "images/AMENITIES/THE GATEWAY - AMENITIES 5.jpg",
    label: "getway sewri gym",
    alt: ""
  },
  {
    src: "images/AMENITIES/THE GATEWAY - AMENITIES 6.jpg",
    label: "Banquet Hall",
    alt: "the gateway banquet hall"
  },
];

const BodyContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [modalButtonTitle, setModalButtonTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [floor, setFloor] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const totalImages = images.length;
  const totalFloors = floorImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalImages]);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const prevSlide2 = () => {
    setFloor((prevFloor) =>
      prevFloor === 0 ? totalFloors - 1 : prevFloor - 1
    );
  };

  const nextSlide2 = () => {
    setFloor((prevFloor) => (prevFloor + 1) % totalFloors);
  };

  const handleOpenModal = (title) => {
    setModalButtonTitle(title);
    setOpen(true);
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone number must be 10 digits long"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("Phone", values.phone);

      const crmData = {
        name: values.name,
        phone: values.phone,
        listId: "65ddf42c7f23ee6edd9f556e", // Add your listId for CRM
        redirect: "", // Add your redirect URL for CRM
      };

      try {
        setIsSubmitted(true);
        // Send data to Google Sheets
        await fetch(
          "https://script.google.com/macros/s/AKfycbxAl8LxLnsM_8-9asLGWi9B6UrRhg0KiygXsfHTOoMF-cVXBcWqJpEA0okhbUPcwAH3/exec",
          {
            method: "POST",
            body: formData,
          }
        );

        // Send data to CRM
        await fetch(
          "https://enterprise.godial.cc/meta/api/externals/contact/add?access_token=nLWC3eZkuDXNbcElB7wXENJZCMM15hmG7GnDJKs6Zdcxqbh4AHq7o24nAiD43K0e",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(crmData),
          }
        );

        formik.resetForm({ name: "", phone: ""});

        // Redirect to thank-you page
        navigate("/thank-you");
      } catch (error) {
        setFormError(true);
        console.log(error);
      }
    },
  });

  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row " id="home">
          <div className="relative w-full sm:h-1/2 lg:w-[70%] lg:h-[calc(100vh-40px)] bg-black flex items-center justify-center overflow-hidden">
            <img
              src={images[currentIndex]}
              alt="best project in sewri"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-white p-2 rounded-full"
              onClick={prevSlide}
            >
              <img
                src="images/LEFT_ARR-removebg-preview.png"
                alt="project in south mumbai"
                className="w-6 h-6" // Adjust the width and height to match the size of the ChevronLeft icon
              />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl text-white p-2 rounded-full"
              onClick={nextSlide}
            >
              <img
                src="images/RIGHT_ARR__2_-removebg-preview.png"
                alt="projects in sewri"
                className="w-6 h-6" // Adjust the width and height to match the size of the ChevronLeft icon
              />
            </button>
          </div>
          <div className="w-full lg:w-[30%] h-auto lg:h-full bg-[#f7f5dd] p-2 my-4 flex flex-col items-center border-5 border-#4ca1af sm:border-5 lg:border-none">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center">
              L&T THE GATEWAY
              <br /> SEWRI
            </h2>
            <div className="flex flex-col items-center border-2 border-black m-2 text-center w-full">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Exclusive Elite Living
              </h2>
              <p className="text-sm sm:text-base lg:text-lg mt-2 mb-[7px] font-[700] border-4 border-#4ca1af text-[#eee4e4] bg-custom-gradient w-full">
                3 Bed Homes: 6.25 Cr* ++
              </p>
              <p className="text-sm sm:text-base lg:text-lg mt-2 mb-[7px] font-[700] border-4 border-#4ca1af text-[#eee4e4] bg-custom-gradient w-full">
                4 Bed Homes: 10.70 Cr* ++
              </p>
              <p className="text-sm sm:text-base lg:text-lg mt-2 mb-[7px] font-[700] border-4 border-#4ca1af text-[#eee4e4] bg-custom-gradient w-full">
                4.5 Bed Homes: 11.60 Cr* ++
              </p>
            </div>

            <button
              className="relative w-full sm:w-4/5 h-[50px] sm:h-[45px] lg:h-[50px] border-none outline-none text-white bg-custom-gradient cursor-pointer z-0 rounded-lg m-2 mt-3 text-sm sm:text-base lg:text-lg font-bold transition duration-300 hover:text-custom-gradient glow-on-hover"
              onClick={() => handleOpenModal("Enquiry")}
            >
              BOOK NOW
            </button>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center">
              L&T THE GATEWAY
              <br /> SEWRI
            </h2>

            <button
              className="relative w-full sm:w-4/5 h-[50px] sm:h-[45px] lg:h-[50px] border-none outline-none text-white bg-custom-gradient cursor-pointer z-0 rounded-lg m-2 text-sm sm:text-base lg:text-lg font-bold transition duration-300 hover:text-custom-gradient glow-on-hover"
              onClick={() => handleOpenModal("Download E Brochure")}
            >
              Download E Brochure
            </button>
          </div>
        </div>

        <div className="bg-[#f7f5dd] w-full text-start" id="about">
          <div className="w-full max-w-7xl p-4 text-start">
            <h1 className="my-4 text-2xl sm:text-4xl md:text-4xl lg:text-[42px] lg:font-bold font-semibold uppercase text-black-700 text-center">
              L&T THE GATEWAY
            </h1>
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
              Ultra Luxurious 3, 4 & 4.5 Bed Homes @ 6.25 Cr* Onwards.
            </h3>
            <p className="text-gray-900 sm:text-lg md:text-lg lg:text-xl xl:text-xl mb-4 sm:mb-6 text-justify">
              Experience <b>L&T The Gateway </b>— a premium twin tower
              architectural marvel offering{" "}
              <b>3, 4 & 4.5 BHK super spacious homes </b> in the heart of South
              Mumbai. Enjoy breathtaking panoramic Sea View and Atal Setu View
              from your private deck. Nestled in a prime location with
              unparalleled access to the Eastern Freeway and upcoming
              infrastructure, this gated community elevates luxury living with
              40 plus lavish amenities, including a swimming pool and state of
              the art fitness facilities. Secure your refined lifestyle in a
              development that embodies L&T legacy of architectural excellence
              and high quality construction.
            </p>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-6 mb-4">
              Project Highlights
            </h2>
            <ul className="list-disc pl-5 text-black sm:text-black md:text-lg lg:text-lg xl:text-xl ">
              <li className="mb-1">Sea Facing Apartments.</li>
              <li className="mb-1">
                Ultra Luxe 3,,4 & 4.5 Bed Residences starting at 6.25 Cr*
              </li>
              <li className="mb-1">5 mins from Indias Longest Sea bridge.</li>
              <li className="mb-1">Low Density Project.</li>
              <li className="mb-1">
                A Grand Clubhouse on the 62nd & 63rd floors.
              </li>
              <li className="mb-1">Air Conditioned Apartments.</li>
            </ul>
          </div>
        </div>

        <div className="price-overview justify-center" id="price-overview">
          <div className="border-[20px] border-solid border-[#4ca1af] bg-[#f7f5dd] pb-3 sm:border-[20px] md:border-[15px] lg:border-[20px]">
            <h1 className="text-center my-4 text-2xl sm:text-4xl md:text-4xl lg:text-[42px] lg:font-bold font-semibold uppercase text-black-800">
              PRICE OVERVIEW
            </h1>
            <table className="table border-1 border-black w-full">
              <thead className="bg-custom-gradient text-center">
                <tr className="border-1">
                  <th className="border-1 px-[11px] py-3 text-xs sm:text-sm md:text-base lg:text-[16px] font-medium text-gray-500 transition-all duration-300 text-center">
                    TYPOLOGY
                  </th>
                  <th className="border-1 px-[11px] py-3 text-xs sm:text-sm md:text-base lg:text-[16px] font-medium text-gray-500 transition-all duration-300 text-center">
                    CARPET AREA (Sq Ft)
                  </th>
                  <th className="border-1 px-[11px] py-3 text-xs sm:text-sm md:text-base lg:text-[16px] font-medium text-gray-500 transition-all duration-300 text-center">
                    All IN
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="border-1 border-black">
                    <td className="border-1 text-center">{row.type}</td>
                    <td className="border-1 text-center">{row.area}</td>
                    <td className="border-1 text-center">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="container mx-auto px-1 sm:px-8" id="gallery">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-center my-8 transition-all duration-300">
            GALLERY
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1vh] p-[1vh] max-w-full mx-auto bg-custom-gradient justify-center">
            {galleryImages.map((src, index) => (
              <div className="gallery-item group" key={index}>
                <img
                  src={src}
                  alt="sea view properties in mumbai"
                  className="w-full h-[300px] object-cover transition-all duration-100 ease-out group-hover:scale-104 group-hover:filter-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="featured-listings" id="amenities">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-center my-8 transition-all duration-300">
            AMENITIES
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 lg:max-w-[60%] lg:mx-auto">
            {aminitiesImages.map((item, index) => (
              <div className="aminitiesImage-item" key={index}>
                <img
                  className="w-full h-48 object-cover"
                  src={item.src}
                  alt={item.alt}
                />
                <h2
                  className="text-center m-2"
                  style={{ fontSize: "22px", fontWeight: "bold" }}
                >
                  {item.label}
                </h2>
              </div>
            ))}
          </div>
        </div>

        <section id="virtual-tour">
          <div className="content max-w-7xl mx-auto mt-12">
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[42px] font-bold text-center my-6 transition-all duration-300">
              VIRTUAL TOUR
            </h1>
            <div className="video-gallery w-full mx-auto px-4 flex justify-center items-center">
              <div className="gallery-item w-full">
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    margin: "0 auto",
                  }}
                >
                  <iframe
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                    src="https://www.youtube.com/embed/7-KU9MbhFrw?rel=0"
                    title="The Gateway Tour"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="floor-plan">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[42px] font-bold text-center my-8 transition-all duration-300">
            FLOOR PLANS
          </h1>
          <div className="container-fl">
            <div className="sliderer">
              <div
                className="slider__slides"
                onClick={() => handleOpenModal("Enquiry")}
              >
                <div className="slider__slide active">
                  <img
                    src={floorImages[floor]}
                    alt="the gateway floor plans"
                    className="slider-image"
                  />
                </div>
              </div>
              <div
                id="nav-button--prev"
                className="slider__nav-button"
                onClick={prevSlide2}
              />
              <div
                id="nav-button--next"
                className="slider__nav-button"
                onClick={nextSlide2}
              />
              <div className="slider__nav">
                {floorImages.map((_, index) => (
                  <div
                    key={index}
                    className={`slider__navlink ${
                      index === floor ? "active" : ""
                    }`}
                    onClick={() => setFloor(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="maps">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-center my-8 transition-all duration-300">
            LOCATION MAP
          </h1>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d7544.851866259421!2d72.854082!3d19.000944!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDAwJzAzLjQiTiA3MsKwNTEnMTQuNyJF!5e0!3m2!1sen!2sin!4v1730378239747!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          ></iframe>
        </section>

        <section
          id="contact-us"
          className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
        >
          <h1 className="text-center my-4 text-2xl sm:text-3xl md:text-4xl lg:text-[48px] lg:font-bold font-semibold uppercase text-black-800">
            CONTACT US
          </h1>

          <div className="flex justify-center items-center mb-6">
            <FaPhone
              onClick={() => window.open("tel:9326959938")}
              style={{
                color: "white",
                backgroundColor: "green",
                borderRadius: "50%",
                fontSize: "30px",
                padding: "5px",
                marginRight: "10px",
              }}
            />
            <span
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl cursor-pointer"
              onClick={() => window.open("tel:9326959938")}
            >
              {" "}
              +91 93269 59938{" "}
            </span>
          </div>

          <h3 className="text-center text-sm font-black sm:text-4xl md:text-lg lg:text-xl font-calibri mb-6">
            Exclusive Limited Time Offer: Unbeatable Discounts Await You!
          </h3>

          <div className="container-f mx-auto max-w-xl">
            {isSubmitted && !formError ? (
              <div className="w-2/5 text-center bg-custom-gradient text-[#fff] mx-auto py-2 border-1 border-#4ca1af">
                <h4 className="text-2xl">Successfully Submitted</h4>
                <h3 className="text-xl">
                  Thank you! We will contact you soon.
                </h3>
              </div>
            ) : formError ? (
              <div className="text-center bg-[#ffff00] text-[#E72744] mx-4 p-4 border-1 border-#4ca1af">
                <p className="text-2xl">
                  Something went wrong. Please try again.
                </p>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="form-group">
                  <input
                    className="form-control w-full px-4 py-2 text-sm sm:text-base md:text-lg border rounded-md"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className="form-control w-full px-4 py-2 text-sm sm:text-base md:text-lg border rounded-md"
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Enter your number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.phone}
                    </span>
                  )}
                </div>

                <button
                  className="glow-on-hover w-full py-auto px-4 text-white rounded-md text-xs sm:text-sm md:text-lg lg:text-xl"
                  type="submit"
                >
                  Book Free Site Assistance
                </button>
              </form>
            )}
          </div>
        </section>

        <div className="foot_top bg-gray-800 text-white py-8 text-center">
          <div className="container mx-auto px-4">
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="foot_left">
                  <h1 className="text-2xl md:text-4xl font-bold">
                    L&T THE GATEWAY, SEWRI
                  </h1>
                  <p className="mt-4 text-base md:text-lg text-justify">
                    Disclaimer: This website is meant only for information
                    purposes. It should not be considered / claimed as an
                    official site. This website belongs to the authorized
                    channel partner of L&T Group. The content provided on this
                    website is for information purposes only and does not
                    constitute an offer to avail any service. The prices
                    mentioned are subject to change without prior notice, and
                    the availability of properties mentioned is not guaranteed.
                    The images displayed on the website are for representation
                    purposes only and may not reflect the actual properties
                    accurately. We may share data with Real Estate Regulatory
                    Authority (RERA) registered brokers/companies for further
                    processing as required. We may also send updates and
                    information to the mobile number or email ID registered with
                    us. All rights reserved. The content, design, and
                    information on this website are protected by copyright and
                    other intellectual property rights. Any unauthorized use or
                    reproduction of the content may violate applicable laws.
                  </p>
                </div>
                <h3 className="text-center justify" style={{ color: "#fff" }}>
                  MahaRERA registration number: P51900054969
                  maharera.mahaonline.gov.in
                </h3>

                <h3 className="text-center justify" style={{ color: "#fff" }}>
                  MahaRERA registration number: A52000032416
                  maharera.mahaonline.gov.in
                </h3>
              </div>
            </div>
          </div>
          <div className="qr-dis mt-6 flex flex-wrap justify-center">
            <img
              className="qr-logo w-full sm:w-26 md:w-39 mb-4"
              src="images/qr.webp"
              alt="gateway rera"
            />
          </div>
        </div>

        <div className="fixed bottom-20 right-10">
          <button
            className="bg-green-400 text-white p-2 mb-3 rounded-full shadow-lg"
            onClick={() => handleOpenModal("Enquiry")}
          >
            <i
              className="floating"
              href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
            >
              <FaWpforms size={30} />
            </i>
          </button>
        </div>

        <a
          href="https://api.whatsapp.com/send?phone=9326959938&text=I am interested in LnT The Gateway, Sewri project and want more information about this project."
          className="floating-button"
          target="_blank"
          rel="noreferrer"
        >
          <div className="floating-btn">
            <FaWhatsapp size={30} />
          </div>
        </a>

        {/* <TestModal onClose="" tile=""  /> */}
        <FormModal
          open={open}
          onClose={() => setOpen(false)}
          formTitle="L&T THE GATEWAY, SEWRI "
          formSubTitle="Register here for Best Offers"
          buttonTitle={modalButtonTitle}
        />
      </div>
    </>
  );
};

export default BodyContent;

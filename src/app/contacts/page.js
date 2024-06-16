'use client';
import LinkedinButton from "../components/LinkedinButton";
import ContactFormWithModel from "../components/contactForm";
import Footer from "../components/footer";

export default function Contacts() {
  return (
    <main id="contacts">
    <div className='h-full w-full'>
      {/* <Navbar/> */}
      <div className="flex min-h-screen items-center justify-center">
      <ContactFormWithModel/>
        {/* <ModelViewer/> */}
      </div>
      {/* <ContactButton/> */}
      <LinkedinButton/>
    </div>
    <Footer/>
</main>

  );
}




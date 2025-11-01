import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import Pagination from "../layout/Pagination";
import { useLanguage } from "@/context/LanguageContext";
import { FaWhatsapp } from "react-icons/fa";
import { getContects } from "@/lib/email";

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { lang } = useLanguage();

  const handleWhatsAppRedirect = (num) => {
    window.open(`https://wa.me/${num}`, "_blank");
  };
  // Function to fetch contacts data
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await getContects(currentPage);

      setContacts(res.contacts.data);
      setCurrentPage(res.contacts.current_page);
      setLastPage(res.contacts.last_page);
      setTotal(res.contacts.total);
    } catch (error) {
      console.error("Failed to load contacts:", error);
      toast.error("Failed to load contacts."); // Added toast error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className=" text-gray-200"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {lang === "ar" ? "إدارة  الاتصال" : "Contacts Management"}
        </h2>
      </div>

      {contacts.length === 0 ? (
        <p>You have no contacts yet.</p>
      ) : (
        <>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>
                  {lang === "ar" ? "الهاتف والواتساب" : "Phone&WhatsApp"}
                </TableHead>
                <TableHead>
                  {lang === "ar" ? "بريد إلكتروني" : "E-mail"}
                </TableHead>
                <TableHead>{lang === "ar" ? "رسالة" : "Message"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((con) => (
                <React.Fragment key={con.id}>
                  <TableRow>
                    <TableCell>{con.id}</TableCell>
                    <TableCell>
                      {con.phone}{" "}
                      <FaWhatsapp
                        onClick={() => handleWhatsAppRedirect(con.phone)}
                        className="h-6 cursor-pointer w-6 text-green-500"
                      />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <a
                        href={`mailto:${con.email}`}
                        className="text-blue-500  hover:text-white hover:underline-offset-2"
                      >
                        {con.email}
                      </a>
                    </TableCell>
                    <TableCell>{con.message}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            label={lang === "ar" ? " الاتصالات" : "Contact"}
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, lastPage))
            }
          />
        </>
      )}
    </motion.div>
  );
};

export default ContactsManagement;

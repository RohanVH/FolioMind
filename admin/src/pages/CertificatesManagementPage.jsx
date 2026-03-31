import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { CertificateList } from "../components/certificates/CertificateList";
import { CertificateForm } from "../components/certificates/CertificateForm";
import { DeleteConfirmModal } from "../components/certificates/DeleteConfirmModal";
import { ToastContainer, useToast } from "../components/certificates/Toast";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from "../api/adminApi";

export const CertificatesManagementPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingTitle, setDeletingTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await getCertificates();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast("Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      if (editing) {
        await updateCertificate(editing._id, formData);
        addToast("Certificate updated successfully", "success");
      } else {
        await createCertificate(formData);
        addToast("Certificate added successfully", "success");
      }
      setShowForm(false);
      setEditing(null);
      await loadCertificates();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save certificate", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (certificate) => {
    setEditing(certificate);
    setShowForm(true);
  };

  const handleDeleteClick = (id, title) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      await deleteCertificate(deletingId);
      addToast("Certificate deleted successfully", "success");
      setDeleteModalOpen(false);
      setDeletingId(null);
      await loadCertificates();
    } catch (err) {
      addToast("Failed to delete certificate", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisibility = async (id, visible) => {
    try {
      const cert = certificates.find(c => c._id === id);
      if (!cert) return;
      
      await updateCertificate(id, {
        ...cert,
        visible
      });
      addToast(visible ? "Certificate shown" : "Certificate hidden", "success");
      await loadCertificates();
    } catch (err) {
      addToast("Failed to update visibility", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Manage Certificates</h1>
            <p className="text-slate-400 mt-1">
              Add, edit, and delete certificates that appear on your portfolio
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-slate-950 hover:bg-primary/90 transition"
            >
              <Plus size={20} />
              Add Certificate
            </button>
          )}
        </div>
      </motion.div>

      {/* Form */}
      {showForm && (
        <CertificateForm
          certificate={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          loading={submitting}
        />
      )}

      {/* Stats */}
      {!showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-slate-900/50 border border-white/10 p-4"
        >
          <p className="text-sm text-slate-400">
            Total certificates: <span className="font-semibold text-slate-200">{certificates.length}</span>
            {" "} | {" "}
            Visible:{" "}
            <span className="font-semibold text-green-400">
              {certificates.filter(c => c.visible).length}
            </span>
          </p>
        </motion.div>
      )}

      {/* List */}
      {!showForm && (
        <CertificateList
          certificates={certificates}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleVisibility={handleToggleVisibility}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title={deletingTitle}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeletingId(null);
        }}
        loading={submitting}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

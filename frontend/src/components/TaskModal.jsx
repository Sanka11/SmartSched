import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const TaskModal = ({ isOpen, onClose, slot, onSave, onDelete, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📌");
  const [color, setColor] = useState("#8e44ad");

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setIcon(initialData.icon || "📌");
      setColor(initialData.color || "#8e44ad");
    } else {
      setTitle("");
      setDescription("");
      setIcon("📌");
      setColor("#8e44ad");
    }
  }, [initialData]);

  const handleSave = async () => {
    const payload = {
      id: initialData?.id,
      email,
      day: slot.day,
      time: slot.time,
      title,
      description,
      icon,
      color
    };
  
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/custom-schedule`, payload);
      onSave(payload); // ✅ pass full payload back to parent
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };
  

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/custom-schedule/delete/${initialData.id}`);
      onDelete(`${slot.day}_${slot.time}`);
      onClose();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add/Edit Task"
      className="modal-content"
      overlayClassName="modal-overlay"
      closeTimeoutMS={200}
    >
      <div className="modal-header">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          <span className="mr-2">📝</span>
          {slot?.day} {slot?.time}
        </h2>
      </div>

      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Enter task title"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input min-h-[80px]"
            placeholder="Enter description (optional)"
            rows="3"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="form-group flex-1">
            <label className="form-label">Icon</label>
            <div className="flex items-center gap-2">
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="form-input-icon"
                maxLength="2"
              />
              <span className="text-xl">{icon}</span>
            </div>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="form-input-color"
              />
              <div 
                className="w-8 h-8 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        {initialData && (
          <button onClick={handleDelete} className="btn-delete">
            Delete Task
          </button>
        )}
        <button onClick={onClose} className="btn-cancel">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="btn-save"
          disabled={!title.trim()}
        >
          Save Task
        </button>
      </div>

      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            padding: 1rem;
            backdrop-filter: blur(2px);
            transition: opacity 200ms ease-in-out;
          }

          .modal-content {
            position: relative;
            background: white;
            border-radius: 0.75rem;
            width: 100%;
            max-width: 28rem;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            outline: none;
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
          }

          .modal-header {
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 1rem;
          }

          .modal-body {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 1.5rem;
          }

          .modal-footer {
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }

          .form-input {
            width: 100%;
            padding: 0.625rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            transition: border-color 0.2s;
          }

          .form-input:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
          }

          .form-input-icon {
            width: 4rem;
            padding: 0.625rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 1rem;
            text-align: center;
          }

          .form-input-color {
            width: 3rem;
            height: 3rem;
            padding: 0;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            cursor: pointer;
          }

          .btn-delete {
            padding: 0.625rem 1rem;
            background-color: #ef4444;
            color: white;
            border-radius: 0.375rem;
            font-weight: 500;
            transition: background-color 0.2s;
          }

          .btn-delete:hover {
            background-color: #dc2626;
          }

          .btn-cancel {
            padding: 0.625rem 1rem;
            background-color: #f3f4f6;
            color: #374151;
            border-radius: 0.375rem;
            font-weight: 500;
            transition: background-color 0.2s;
          }

          .btn-cancel:hover {
            background-color: #e5e7eb;
          }

          .btn-save {
            padding: 0.625rem 1rem;
            background-color: #8b5cf6;
            color: white;
            border-radius: 0.375rem;
            font-weight: 500;
            transition: background-color 0.2s;
          }

          .btn-save:hover {
            background-color: #7c3aed;
          }

          .btn-save:disabled {
            background-color: #cbd5e1;
            cursor: not-allowed;
          }

          @media (max-width: 640px) {
            .modal-content {
              padding: 1rem;
            }

            .modal-footer {
              flex-direction: column-reverse;
            }

            .modal-footer button {
              width: 100%;
            }
          }
        `}
      </style>
    </Modal>
  );
};

export default TaskModal;

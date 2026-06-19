import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Modal, PageHeader, LoadingSpinner, EmptyState, Card } from '../../components/common/UIComponents';
import MainLayout from '../../layouts/MainLayout';
import adminAPI from '../../api/admin.api';

export const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  const [form, setForm] = useState({
    name: '',
    capacity: 30,
    section: '',
    subjects: ''
  });

  const [selectedTeacher, setSelectedTeacher] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesRes, teachersRes] = await Promise.all([
        adminAPI.getClasses(),
        adminAPI.getAllTeachers(),
      ]);

      setClasses(classesRes.data.classes || []);
      setTeachers(teachersRes.data.teachers || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // CREATE CLASS
  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error('Class name is required');
      return;
    }

    try {
      setSubmitting(true);

      const response = await adminAPI.createClass({
        name: form.name,
        capacity: Number(form.capacity),
        section: form.section,
        subjects: form.subjects
          ? form.subjects.split(',').map(s => s.trim())
          : [],
      });

      toast.success(response.data.message || 'Class created successfully');

      setClasses([...classes, response.data.class]);
      setModal(null);

      setForm({
        name: '',
        capacity: 30,
        section: '',
        subjects: ''
      });

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  // UPDATE CLASS
  const handleUpdate = async () => {
    if (!form.name.trim()) {
      toast.error('Class name is required');
      return;
    }

    try {
      setSubmitting(true);

      await adminAPI.updateClass(selectedClass._id, {
        name: form.name,
        capacity: Number(form.capacity),
        section: form.section,
        subjects: form.subjects
          ? form.subjects.split(',').map(s => s.trim())
          : [],
      });

      toast.success('Class updated successfully');

      setClasses(classes.map((c) =>
        c._id === selectedClass._id
          ? {
              ...c,
              name: form.name,
              capacity: form.capacity,
              section: form.section,
              subjects: form.subjects
                ? form.subjects.split(',').map(s => s.trim())
                : [],
            }
          : c
      ));

      setModal(null);
      setSelectedClass(null);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update class');
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      await adminAPI.deleteClass(classId);
      setClasses(classes.filter((c) => c._id !== classId));
      toast.success('Class deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete class');
    }
  };

  // ASSIGN TEACHER
  const handleAssignTeacher = async () => {
    if (!selectedTeacher) {
      toast.error('Please select a teacher');
      return;
    }

    try {
      setSubmitting(true);

      await adminAPI.assignTeacherToClass({
        classId: selectedClass._id,
        teacherId: selectedTeacher,
      });

      const teacher = teachers.find(t => t._id === selectedTeacher);

      setClasses(classes.map(c =>
        c._id === selectedClass._id
          ? { ...c, classTeacher: teacher }
          : c
      ));

      toast.success('Teacher assigned successfully');

      setModal(null);
      setSelectedClass(null);
      setSelectedTeacher('');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (cls) => {
    setSelectedClass(cls);

    setForm({
      name: cls.name || cls.className || '',
      capacity: cls.capacity || 30,
      section: cls.section || '',
      subjects: cls.subjects ? cls.subjects.join(', ') : '',
    });

    setModal('edit');
  };

  const openAssignTeacherModal = (cls) => {
    setSelectedClass(cls);
    setSelectedTeacher(cls.classTeacher?._id || '');
    setModal('assign-teacher');
  };

  // FILTER
  const filtered = classes.filter((c) => {
    const name = (c.name || c.className || '').toLowerCase();
    const section = (c.section || '').toLowerCase();
    const teacher = (c.classTeacher?.fullname || '').toLowerCase();
    const q = search.toLowerCase();

    return name.includes(q) || section.includes(q) || teacher.includes(q);
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" dark />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Class Management"
        subtitle="Create and manage school classes"
        action={
          <Button
            onClick={() => {
              setModal('create');
              setForm({ name: '', capacity: 30, section: '', subjects: '' });
            }}
          >
            ➕ Create Class
          </Button>
        }
      />

      {/* SEARCH */}
      <input
        className="sms-input mb-4"
        placeholder="Search classes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon="📚" text="No classes found" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((cls) => (
            <div key={cls._id} className="sms-card p-4">
              <h2 className="font-bold text-lg">
                {cls.name || cls.className}
              </h2>

              <p className="text-sm">
                👨‍🏫 {cls.classTeacher?.fullname || 'Not assigned'}
              </p>

              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => openAssignTeacherModal(cls)}>
                  Assign
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEditModal(cls)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(cls._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={modal === 'create' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Create Class' : 'Edit Class'}
      >
        <input
          className="sms-input"
          placeholder="Class name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="sms-input mt-2"
          placeholder="Section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
        />

        <input
          className="sms-input mt-2"
          type="number"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />

        <input
          className="sms-input mt-2"
          placeholder="Subjects"
          value={form.subjects}
          onChange={(e) => setForm({ ...form, subjects: e.target.value })}
        />

        <Button
          className="mt-3 w-full"
          disabled={submitting}
          onClick={modal === 'create' ? handleCreate : handleUpdate}
        >
          {modal === 'create' ? 'Create' : 'Update'}
        </Button>
      </Modal>

      {/* ✅ ASSIGN TEACHER MODAL (ADDED FIX) */}
      <Modal
        isOpen={modal === 'assign-teacher'}
        onClose={() => {
          setModal(null);
          setSelectedClass(null);
          setSelectedTeacher('');
        }}
        title={`Assign Teacher - ${selectedClass?.name || selectedClass?.className}`}
      >
        <div className="sms-form-group">
          <label className="sms-label">Select Teacher</label>

          <select
            className="sms-input"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">-- Select Teacher --</option>

            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.fullname} {t.subject ? `(${t.subject})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => {
              setModal(null);
              setSelectedClass(null);
              setSelectedTeacher('');
            }}
          >
            Cancel
          </Button>

          <Button
            className="flex-1"
            disabled={submitting}
            onClick={handleAssignTeacher}
          >
            {submitting ? <LoadingSpinner size="sm" /> : 'Assign Teacher'}
          </Button>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default ClassManagementPage;
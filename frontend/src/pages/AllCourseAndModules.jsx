import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiX, FiChevronDown, FiChevronUp, FiMail, FiClock } from 'react-icons/fi';

function AllCourseAndModules() {
  // State management
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({
    id: '',
    name: '',
    description: '',
    courseFee: '',
    courseDuration: '',
    contactEmail: '',
    modules: [],
    groups: []
  });
  const [newModule, setNewModule] = useState({ title: '', description: '' });
  const [newGroup, setNewGroup] = useState({ groupName: '' });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses function
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/allcourses');
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handler functions
  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    
    // Special handling for course duration to ensure 2 digits max
    if (name === 'courseDuration') {
      if (value === '' || (value.length <= 2 && /^\d*$/.test(value))) {
        setter(prev => ({ ...prev, [name]: value }));
      }
      return;
    }
    
    setter(prev => ({ ...prev, [name]: value }));
  };

  const addListItem = (item, setItem, listName) => {
    if (!item[Object.keys(item)[0]]) return;
    
    const newItem = {
      [`${listName.slice(0, -1)}Id`]: Date.now().toString(),
      ...item
    };
    
    setCourse(prev => ({
      ...prev,
      [listName]: [...prev[listName], newItem]
    }));
    setItem(listName === 'modules' ? { title: '', description: '' } : { groupName: '' });
  };

  const removeListItem = (index, listName) => {
    setCourse(prev => {
      const updatedList = [...prev[listName]];
      updatedList.splice(index, 1);
      return { ...prev, [listName]: updatedList };
    });
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate course form
  const validateCourseForm = () => {
    if (!course.name) {
      setError('Course name is required');
      return false;
    }
    if (!course.courseFee || isNaN(course.courseFee) || parseFloat(course.courseFee) <= 0) {
      setError('Please enter a valid course fee');
      return false;
    }
    if (!course.courseDuration || course.courseDuration.length > 2 || isNaN(course.courseDuration) || parseInt(course.courseDuration) <= 0) {
      setError('Please enter a valid duration (1-99 months)');
      return false;
    }
    if (!course.contactEmail || !validateEmail(course.contactEmail)) {
      setError('Please enter a valid contact email');
      return false;
    }
    if (!course.description) {
      setError('Course description is required');
      return false;
    }
    return true;
  };

  // Course CRUD operations
  const submitCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!validateCourseForm()) {
      setLoading(false);
      return;
    }
    
    try {
      if (editingCourseId) {
        // Update existing course
        const response = await axios.put(
          `http://localhost:8080/api/allcourses/${editingCourseId}`,
          { ...course, id: editingCourseId }
        );
        alert('Course updated successfully!');
      } else {
        // Create new course - remove id field
        const { id, ...newCourse } = course;
        const response = await axios.post(
          'http://localhost:8080/api/allcourses',
          newCourse
        );
        alert('Course created successfully!');
      }
      await fetchCourses();
      resetForm();
      setIsFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
      console.error('Error saving course:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!courseId || !window.confirm('Are you sure you want to delete this course?')) return;
    
    setIsDeleting(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:8080/api/allcourses/${courseId}`);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
      console.error('Error deleting course:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper functions
  const editCourse = (courseToEdit) => {
    if (!courseToEdit?.id) {
      setError('Invalid course data');
      return;
    }
    
    setCourse({
      ...courseToEdit,
      id: courseToEdit.id,
      modules: [...(courseToEdit.modules || [])],
      groups: [...(courseToEdit.groups || [])]
    });
    setEditingCourseId(courseToEdit.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCourse({
      id: '',
      name: '',
      description: '',
      courseFee: '',
      courseDuration: '',
      contactEmail: '',
      modules: [],
      groups: []
    });
    setEditingCourseId(null);
    setError(null);
  };

  const toggleCourseExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Filter and render
  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
            <p className="text-gray-600 mt-1">Manage all courses, modules, and groups</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <FiPlus /> Add New Course
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Course Form */}
        {isFormOpen && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                {editingCourseId ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button onClick={() => { setIsFormOpen(false); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={submitCourse} className="space-y-6">
              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Course Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={course.name}
                    onChange={(e) => handleInputChange(e, setCourse)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Data Science"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Course Fee (Rs)*</label>
                  <input
                    type="number"
                    name="courseFee"
                    value={course.courseFee}
                    onChange={(e) => handleInputChange(e, setCourse)}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50000"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Duration (Months 1-99)*</label>
                  <input
                    type="text"
                    name="courseDuration"
                    value={course.courseDuration}
                    onChange={(e) => handleInputChange(e, setCourse)}
                    required
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 6"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Contact Email*</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={course.contactEmail}
                    onChange={(e) => handleInputChange(e, setCourse)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@example.com"
                  />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description*</label>
                  <textarea
                    name="description"
                    value={course.description}
                    onChange={(e) => handleInputChange(e, setCourse)}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the course"
                  />
                </div>
              </div>
              
              {/* Modules Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium text-gray-700 mb-4">Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {['title', 'description'].map(field => (
                    <div key={field} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {field === 'title' ? 'Module Title' : 'Description'}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={newModule[field]}
                        onChange={(e) => handleInputChange(e, setNewModule)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={field === 'title' ? 'e.g., Python Basics' : 'Brief description'}
                      />
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => addListItem(newModule, setNewModule, 'modules')}
                  disabled={!newModule.title}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  <FiPlus /> Add Module
                </button>
                
                {course.modules.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-gray-700">Added Modules ({course.modules.length})</h4>
                    {course.modules.map((module, index) => (
                      <div key={module.moduleId} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{module.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeListItem(index, 'modules')}
                          className="p-1 text-red-600 hover:text-red-700 focus:outline-none"
                          aria-label="Remove module"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Groups Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium text-gray-700 mb-4">Groups</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Group Name</label>
                    <input
                      type="text"
                      name="groupName"
                      value={newGroup.groupName}
                      onChange={(e) => handleInputChange(e, setNewGroup)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Group A"
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => addListItem(newGroup, setNewGroup, 'groups')}
                  disabled={!newGroup.groupName}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  <FiPlus /> Add Group
                </button>
                
                {course.groups.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-gray-700">Added Groups ({course.groups.length})</h4>
                    {course.groups.map((group, index) => (
                      <div key={group.groupId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-800">{group.groupName}</span>
                        <button 
                          type="button" 
                          onClick={() => removeListItem(index, 'groups')}
                          className="p-1 text-red-600 hover:text-red-700 focus:outline-none"
                          aria-label="Remove group"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => { setIsFormOpen(false); resetForm(); }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-green-400"
                >
                  {loading ? 'Processing...' : editingCourseId ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-700">All Courses</h2>
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No courses match your search' : 'No courses added yet'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Course
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((courseItem) => (
                <div key={courseItem.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCourseExpand(courseItem.id)}
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{courseItem.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{courseItem.description}</p>
                      
                      {/* Enhanced Course Details */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div className="flex items-center text-blue-600">
                          <span>Rs {courseItem.courseFee}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FiClock className="mr-1" />
                          <span>{courseItem.courseDuration} months</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FiMail className="mr-1" />
                          <span>{courseItem.contactEmail}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); editCourse(courseItem); }}
                        className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors"
                        aria-label="Edit course"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (courseItem.id) deleteCourse(courseItem.id); 
                        }}
                        disabled={isDeleting}
                        className={`p-2 rounded-full transition-colors ${isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`}
                        aria-label="Delete course"
                      >
                        <FiTrash2 />
                      </button>
                      {expandedCourse === courseItem.id ? (
                        <FiChevronUp className="text-gray-500" />
                      ) : (
                        <FiChevronDown className="text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  {expandedCourse === courseItem.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <span>Modules</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {courseItem.modules?.length || 0}
                            </span>
                          </h4>
                          <ul className="space-y-2">
                            {courseItem.modules?.length > 0 ? (
                              courseItem.modules.map((module) => (
                                <li key={`${courseItem.id}-module-${module.moduleId}`} className="p-3 bg-white rounded-lg border border-gray-200">
                                  <h5 className="font-medium text-gray-800">{module.title}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                </li>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No modules added</p>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <span>Groups</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {courseItem.groups?.length || 0}
                            </span>
                          </h4>
                          <ul className="space-y-2">
                            {courseItem.groups?.length > 0 ? (
                              courseItem.groups.map((group) => (
                                <li key={`${courseItem.id}-group-${group.groupId}`} className="p-3 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                                  <span className="font-medium text-gray-800">{group.groupName}</span>
                                </li>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No groups added</p>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllCourseAndModules;
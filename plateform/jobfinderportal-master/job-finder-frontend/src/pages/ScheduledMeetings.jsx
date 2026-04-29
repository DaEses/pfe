import { useState } from 'react';
import '../styles/ScheduledMeetings.css';

function ScheduledMeetings() {
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      applicant: 'Jane Doe',
      position: 'Product Manager',
      dateTime: '2024-04-02 10:00 AM',
      interviewer: 'Sarah Wilson',
      location: 'Conference Room A',
      status: 'scheduled',
      notes: 'First round interview'
    },
    {
      id: 2,
      applicant: 'Mike Johnson',
      position: 'UI/UX Designer',
      dateTime: '2024-04-03 2:00 PM',
      interviewer: 'Tom Brown',
      location: 'Virtual - Zoom',
      status: 'scheduled',
      notes: 'Technical assessment'
    },
    {
      id: 3,
      applicant: 'John Smith',
      position: 'Senior Developer',
      dateTime: '2024-04-05 11:30 AM',
      interviewer: 'Alex Davis',
      location: 'Conference Room B',
      status: 'scheduled',
      notes: 'Final round'
    }
  ]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [formData, setFormData] = useState({
    applicant: '',
    position: '',
    dateTime: '',
    interviewer: '',
    location: '',
    notes: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMeeting = {
      id: meetings.length + 1,
      ...formData,
      status: 'scheduled'
    };

    setMeetings([...meetings, newMeeting]);
    setFormData({
      applicant: '',
      position: '',
      dateTime: '',
      interviewer: '',
      location: '',
      notes: ''
    });
    setShowScheduleModal(false);
    setSuccessMessage('Meeting scheduled successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const cancelMeeting = (id) => {
    setMeetings(meetings.filter(m => m.id !== id));
    setSelectedMeeting(null);
    setSuccessMessage('Meeting cancelled');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const completeMeeting = (id) => {
    setMeetings(meetings.map(m =>
      m.id === id ? { ...m, status: 'completed' } : m
    ));
    setSelectedMeeting(null);
    setSuccessMessage('Meeting marked as completed');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const sortedMeetings = [...meetings].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const upcomingMeetings = sortedMeetings.filter(m => m.status === 'scheduled');
  const completedMeetings = sortedMeetings.filter(m => m.status === 'completed');

  return (
    <div className="scheduled-meetings">
      <div className="page-header">
        <div>
          <h1>Scheduled Meetings</h1>
          <p className="page-subtitle">Manage interview schedules</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
          + Schedule Meeting
        </button>
      </div>

      {successMessage && <div className="success-msg">{successMessage}</div>}

      <div className="meetings-sections">
        <div className="meetings-section">
          <h2>📅 Upcoming Meetings ({upcomingMeetings.length})</h2>

          {upcomingMeetings.length > 0 ? (
            <div className="meetings-list">
              {upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="meeting-card">
                  <div className="meeting-header">
                    <div>
                      <h3>{meeting.applicant}</h3>
                      <p className="meeting-position">{meeting.position}</p>
                    </div>
                    <span className="badge badge-info">Scheduled</span>
                  </div>

                  <div className="meeting-info-grid">
                    <div className="info-item">
                      <span className="info-label">📅 Date & Time</span>
                      <span className="info-value">{meeting.dateTime}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">👤 Interviewer</span>
                      <span className="info-value">{meeting.interviewer}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📍 Location</span>
                      <span className="info-value">{meeting.location}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📝 Notes</span>
                      <span className="info-value">{meeting.notes || 'No notes'}</span>
                    </div>
                  </div>

                  <div className="meeting-actions">
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-success btn-small"
                      onClick={() => completeMeeting(meeting.id)}
                    >
                      Mark Complete
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => cancelMeeting(meeting.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No upcoming meetings scheduled</p>
            </div>
          )}
        </div>

        {completedMeetings.length > 0 && (
          <div className="meetings-section completed-section">
            <h2>✅ Completed Meetings ({completedMeetings.length})</h2>
            <div className="meetings-list">
              {completedMeetings.map(meeting => (
                <div key={meeting.id} className="meeting-card completed">
                  <div className="meeting-header">
                    <div>
                      <h3>{meeting.applicant}</h3>
                      <p className="meeting-position">{meeting.position}</p>
                    </div>
                    <span className="badge badge-success">Completed</span>
                  </div>
                  <div className="meeting-info-grid">
                    <div className="info-item">
                      <span className="info-label">📅 Date & Time</span>
                      <span className="info-value">{meeting.dateTime}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">👤 Interviewer</span>
                      <span className="info-value">{meeting.interviewer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showScheduleModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Schedule New Meeting</h2>
              <button
                className="modal-close"
                onClick={() => setShowScheduleModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="meeting-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Applicant Name *</label>
                  <input
                    type="text"
                    name="applicant"
                    value={formData.applicant}
                    onChange={handleInputChange}
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Position *</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g., Product Manager"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date & Time *</label>
                  <input
                    type="text"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024-04-02 10:00 AM"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Interviewer *</label>
                  <input
                    type="text"
                    name="interviewer"
                    value={formData.interviewer}
                    onChange={handleInputChange}
                    placeholder="e.g., Sarah Wilson"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Conference Room A or Virtual - Zoom"
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMeeting && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedMeeting.applicant}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedMeeting(null)}
              >
                ✕
              </button>
            </div>

            <div className="meeting-details">
              <div className="detail-row">
                <span className="detail-label">Position:</span>
                <span className="detail-value">{selectedMeeting.position}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Date & Time:</span>
                <span className="detail-value">{selectedMeeting.dateTime}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Interviewer:</span>
                <span className="detail-value">{selectedMeeting.interviewer}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{selectedMeeting.location}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Notes:</span>
                <span className="detail-value">{selectedMeeting.notes || 'No notes'}</span>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedMeeting(null)}
                style={{ marginTop: '20px', width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduledMeetings;

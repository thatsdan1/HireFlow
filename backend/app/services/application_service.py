import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationCreate, ApplicationUpdate
from app.models.resume import Resume
from app.models.job import JobDescription

logger = logging.getLogger(__name__)

class ApplicationService:
    def __init__(self):
        self.status_options = [
            'applied', 'under_review', 'interview_scheduled', 
            'interviewed', 'offer_received', 'accepted', 'rejected', 'withdrawn'
        ]
    
    async def create_application(self, db: Session, user_id: int, resume_id: int, 
                               job_id: int, company: str, position: str) -> Dict[str, Any]:
        """Create a new job application"""
        try:
            # Check if application already exists
            existing_app = db.query(Application).filter(
                Application.user_id == user_id,
                Application.job_id == job_id
            ).first()
            
            if existing_app:
                raise Exception("Application already exists for this job")
            
            # Create application
            application_data = ApplicationCreate(
                user_id=user_id,
                resume_id=resume_id,
                job_id=job_id,
                company_name=company,
                position_title=position,
                status='applied',
                applied_date=date.today(),
                last_updated=datetime.now()
            )
            
            db_application = Application(**application_data.dict())
            db.add(db_application)
            db.commit()
            db.refresh(db_application)
            
            logger.info(f"Application created successfully for user {user_id}")
            
            return {
                'success': True,
                'application_id': db_application.id,
                'message': 'Application created successfully'
            }
            
        except Exception as error:
            logger.error(f"Application creation failed: {error}", exc_info=True)
            raise Exception(f"Failed to create application: {str(error)}")
    
    async def get_user_applications(self, db: Session, user_id: int) -> Dict[str, Any]:
        """Get all applications for a user"""
        try:
            applications = db.query(Application).filter(
                Application.user_id == user_id
            ).order_by(Application.applied_date.desc()).all()
            
            application_list = []
            for app in applications:
                # Get resume and job details
                resume = db.query(Resume).filter(Resume.id == app.resume_id).first()
                job = db.query(JobDescription).filter(JobDescription.id == app.job_id).first()
                
                application_list.append({
                    'id': app.id,
                    'company_name': app.company_name,
                    'position_title': app.position_title,
                    'status': app.status,
                    'applied_date': app.applied_date.isoformat() if app.applied_date else None,
                    'last_updated': app.last_updated.isoformat() if app.last_updated else None,
                    'resume_version': resume.version_name if resume else 'Unknown',
                    'job_description': job.description_text[:100] + "..." if job and job.description_text else 'No description',
                    'resume_id': app.resume_id,
                    'job_id': app.job_id
                })
            
            return {
                'success': True,
                'applications': application_list,
                'total_count': len(application_list)
            }
            
        except Exception as error:
            logger.error(f"Failed to get applications: {error}", exc_info=True)
            raise Exception(f"Failed to retrieve applications: {str(error)}")
    
    async def update_application_status(self, db: Session, application_id: int, 
                                     user_id: int, new_status: str, 
                                     notes: Optional[str] = None) -> Dict[str, Any]:
        """Update application status"""
        try:
            # Validate status
            if new_status not in self.status_options:
                raise Exception(f"Invalid status. Must be one of: {', '.join(self.status_options)}")
            
            # Get application
            application = db.query(Application).filter(
                Application.id == application_id,
                Application.user_id == user_id
            ).first()
            
            if not application:
                raise Exception("Application not found")
            
            # Update status
            application.status = new_status
            application.last_updated = datetime.now()
            
            if notes:
                application.notes = notes
            
            db.commit()
            
            logger.info(f"Application {application_id} status updated to {new_status}")
            
            return {
                'success': True,
                'message': f'Application status updated to {new_status}',
                'new_status': new_status
            }
            
        except Exception as error:
            logger.error(f"Status update failed: {error}", exc_info=True)
            raise Exception(f"Failed to update status: {str(error)}")
    
    async def get_application_stats(self, db: Session, user_id: int) -> Dict[str, Any]:
        """Get application statistics for dashboard"""
        try:
            applications = db.query(Application).filter(
                Application.user_id == user_id
            ).all()
            
            total_applications = len(applications)
            
            # Count by status
            status_counts = {}
            for status in self.status_options:
                status_counts[status] = len([app for app in applications if app.status == status])
            
            # Calculate success rate (interviews + offers)
            successful_statuses = ['interview_scheduled', 'interviewed', 'offer_received', 'accepted']
            successful_count = sum(status_counts.get(status, 0) for status in successful_statuses)
            success_rate = (successful_count / total_applications * 100) if total_applications > 0 else 0
            
            # Recent applications (last 30 days)
            thirty_days_ago = date.today() - timedelta(days=30)
            recent_applications = len([
                app for app in applications 
                if app.applied_date and app.applied_date >= thirty_days_ago
            ])
            
            return {
                'success': True,
                'stats': {
                    'total_applications': total_applications,
                    'status_breakdown': status_counts,
                    'success_rate': round(success_rate, 1),
                    'recent_applications': recent_applications,
                    'successful_count': successful_count
                }
            }
            
        except Exception as error:
            logger.error(f"Failed to get application stats: {error}", exc_info=True)
            raise Exception(f"Failed to retrieve application statistics: {str(error)}")
    
    async def add_application_notes(self, db: Session, application_id: int, 
                                   user_id: int, notes: str) -> Dict[str, Any]:
        """Add notes to an application"""
        try:
            application = db.query(Application).filter(
                Application.id == application_id,
                Application.user_id == user_id
            ).first()
            
            if not application:
                raise Exception("Application not found")
            
            # Add timestamp to notes
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
            if application.notes:
                application.notes += f"\n[{timestamp}] {notes}"
            else:
                application.notes = f"[{timestamp}] {notes}"
            
            application.last_updated = datetime.now()
            db.commit()
            
            logger.info(f"Notes added to application {application_id}")
            
            return {
                'success': True,
                'message': 'Notes added successfully',
                'notes': application.notes
            }
            
        except Exception as error:
            logger.error(f"Failed to add notes: {error}", exc_info=True)
            raise Exception(f"Failed to add notes: {str(error)}")
    
    async def delete_application(self, db: Session, application_id: int, 
                               user_id: int) -> Dict[str, Any]:
        """Delete an application"""
        try:
            application = db.query(Application).filter(
                Application.id == application_id,
                Application.user_id == user_id
            ).first()
            
            if not application:
                raise Exception("Application not found")
            
            db.delete(application)
            db.commit()
            
            logger.info(f"Application {application_id} deleted for user {user_id}")
            
            return {
                'success': True,
                'message': 'Application deleted successfully'
            }
            
        except Exception as error:
            logger.error(f"Failed to delete application: {error}", exc_info=True)
            raise Exception(f"Failed to delete application: {str(error)}")
    
    async def get_application_details(self, db: Session, application_id: int, 
                                    user_id: int) -> Dict[str, Any]:
        """Get detailed information about an application"""
        try:
            application = db.query(Application).filter(
                Application.id == application_id,
                Application.user_id == user_id
            ).first()
            
            if not application:
                raise Exception("Application not found")
            
            # Get related data
            resume = db.query(Resume).filter(Resume.id == application.resume_id).first()
            job = db.query(JobDescription).filter(JobDescription.id == application.job_id).first()
            
            return {
                'success': True,
                'application': {
                    'id': application.id,
                    'company_name': application.company_name,
                    'position_title': application.position_title,
                    'status': application.status,
                    'applied_date': application.applied_date.isoformat() if application.applied_date else None,
                    'last_updated': application.last_updated.isoformat() if application.last_updated else None,
                    'notes': application.notes,
                    'resume': {
                        'id': resume.id if resume else None,
                        'version_name': resume.version_name if resume else 'Unknown',
                        'template_id': resume.template_id if resume else None
                    } if resume else None,
                    'job': {
                        'id': job.id if job else None,
                        'description': job.description_text if job else None,
                        'requirements': job.requirements_extracted if job else None,
                        'keywords': eval(job.keywords) if job and job.keywords else []
                    } if job else None
                }
            }
            
        except Exception as error:
            logger.error(f"Failed to get application details: {error}", exc_info=True)
            raise Exception(f"Failed to retrieve application details: {str(error)}")
    
    def get_status_options(self) -> List[str]:
        """Get available status options"""
        return self.status_options.copy()
    
    def get_status_display_names(self) -> Dict[str, str]:
        """Get human-readable status names"""
        return {
            'applied': 'Applied',
            'under_review': 'Under Review',
            'interview_scheduled': 'Interview Scheduled',
            'interviewed': 'Interviewed',
            'offer_received': 'Offer Received',
            'accepted': 'Accepted',
            'rejected': 'Rejected',
            'withdrawn': 'Withdrawn'
        } 
from django.shortcuts import render
from .models import *
from authapp.permissions import *
from .serializers import *

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Create your views here.

# ============================Course==========================================================
class CourseCreateView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def post(self, request):
        serializer = CourseCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        course = serializer.save()

        return Response({
            "message": "Course created",
            "course_id": course.id
        })
    
class CourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)

        return Response(serializer.data)
    
class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

        serializer = CourseSerializer(course)
        return Response(serializer.data)
    
class CourseUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def put(self, request, pk):
        try:
            course = Course.objects.get(pk=pk, instructor=request.user)
        except Course.DoesNotExist:
            return Response({"error": "Not allowed"}, status=403)

        serializer = CourseCreateSerializer(course, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message": "Course updated"})
    
class CourseDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def delete(self, request, pk):
        try:
            course = Course.objects.get(pk=pk, instructor=request.user)
        except Course.DoesNotExist:
            return Response({"error": "Not allowed"}, status=403)

        course.delete()
        return Response({"message": "Course deleted"})
    
# ============================Course==========================================================

class EnrollView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = EnrollmentCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        enrollment = serializer.save()

        return Response({
            "message": "Enrolled successfully",
            "enrollment_id": enrollment.id
        })
    
class MyCoursesView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    
class MyEnrollmentsView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        enrollments = Enrollment.objects.filter(student=request.user)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)
    
class LessonCreateView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def post(self, request):
        serializer = LessonSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lesson = serializer.save()

        return Response({"message": "Lesson created", "id": lesson.id})
    
class LessonListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        lessons = Lesson.objects.filter(course_id=course_id).order_by("order")
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    
class LessonDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            lesson = Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        serializer = LessonSerializer(lesson)
        return Response(serializer.data)
    
class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        return Response({
            "total_courses": Course.objects.count(),
            "total_enrollments": Enrollment.objects.count(),
            "total_students": User.objects.filter(role="student").count(),
            "total_instructors": User.objects.filter(role="instructor").count(),
        })

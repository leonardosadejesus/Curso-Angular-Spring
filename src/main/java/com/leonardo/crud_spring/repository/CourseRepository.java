package com.leonardo.crud_spring.repository;


import com.leonardo.crud_spring.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {

}
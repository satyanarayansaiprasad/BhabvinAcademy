import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    if (!listOfCourses || !Array.isArray(listOfCourses)) {
      return {
        totalProfit: "0.00",
        totalStudents: 0,
        studentList: [],
      };
    }

    let totalProfit = 0;
    let totalStudents = 0;
    const studentList = [];

    listOfCourses.forEach((course) => {
      if (course && course.students && Array.isArray(course.students)) {
        totalStudents += course.students.length;

        course.students.forEach((student) => {
          // Sum up the actual profit
          const amountPaid = student.paidAmount ? parseFloat(student.paidAmount) : (course.pricing || 0);
          totalProfit += amountPaid;

          // Add to global student list
          studentList.push({
            courseTitle: course.title || "Untitled Course",
            studentName: student.studentName || "Guest Student",
            studentEmail: student.studentEmail || "Not Provided",
            purchasedDate: student.purchasedDate || null,
          });
        });
      }
    });

    // Simple sort: Most recent at top if date exists, otherwise stay in order
    const finalStudentList = [...studentList].sort((a, b) => {
      if (a.purchasedDate && b.purchasedDate) {
        return new Date(b.purchasedDate) - new Date(a.purchasedDate);
      }
      return 0;
    });

    return {
      totalProfit: totalProfit.toFixed(2),
      totalStudents,
      studentList: finalStudentList,
    };
  }

  const stats = calculateTotalStudentsAndProfit();

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `₹${stats.totalProfit}`,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {config.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[32px] p-8 border border-zinc-200/60 shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div className="bg-zinc-100 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Active
              </div>
            </div>
            <div>
              <p className="text-zinc-500 font-bold text-sm mb-1">{item.label}</p>
              <h3 className="text-[28px] font-black tracking-tighter text-zinc-900">
                {item.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[40px] border border-zinc-200/60 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Students Overview.</h2>
          <Button variant="ghost" className="text-zinc-400 font-bold text-sm underline underline-offset-4">Export List</Button>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent border-zinc-100">
                <TableHead className="py-5 px-8 font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Course Name</TableHead>
                <TableHead className="py-5 px-8 font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Student Name</TableHead>
                <TableHead className="py-5 px-8 font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Email Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.studentList.length > 0 ? (
                stats.studentList.map((studentItem, index) => (
                  <TableRow key={index} className="group hover:bg-zinc-50/50 transition-colors border-zinc-100">
                    <TableCell className="py-6 px-8">
                      <span className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {studentItem.courseTitle}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-8 font-medium text-zinc-600">
                      {studentItem.studentName}
                    </TableCell>
                    <TableCell className="py-6 px-8 font-medium text-zinc-400 font-mono text-sm">
                      {studentItem.studentEmail}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-20 text-center text-zinc-400 font-medium italic">
                    No student records found in the database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}

export default InstructorDashboard;

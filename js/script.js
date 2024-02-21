var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var employeeDBName = "EMP-DB";
var employeeRelationName = "EmpData";
var connectionToken = "90931965|-31949303057903837|90960493";

$("#empId").focus();
function validateData() {
  var empIdVar = $("#empId").val();
  if (empIdVar === "") {
    alert("Employee ID Required Value");
    $("#empId").focus();
    return "";
  }
  var empNameVar = $("#empName").val();
  if (empNameVar === "") {
    alert("Employee Name is Required Value");
    $("#empName").focus();
    return "";
  }
  var empSalaryVar = $("#empSalary").val();
  if (empSalaryVar === "") {
    alert("Employee Salary is Required Value");
    $("#empSalary").focus();
    return "";
  }
  var empHRAVar = $("#empHRA").val();
  if (empHRAVar === "") {
    alert("Employee HRA is Required Value");
    $("#empHRA").focus();
    return "";
  }
  var empDAVar = $("#empDA").val();
  if (empDAVar === "") {
    alert("Employee DA is Required Value");
    $("#empDA").focus();
    return "";
  }
  var empDeductionVar = $("#empDeduction").val();
  if (empDeductionVar === "") {
    alert("Employee Deduction is Required Value");
    $("#empDeduction").focus();
    return "";
  }
  var jsonStrObj = {
    id: empIdVar,
    name: empNameVar,
    salary: empSalaryVar,
    hra: empHRAVar,
    da: empDAVar,
    deduction: empDeductionVar,
  };
  return JSON.stringify(jsonStrObj);
}

function resetForm() {
  $("#empId").val("");
  $("#empName").val("");
  $("#empSalary").val("");
  $("#empHRA").val("");
  $("#empDA").val("");
  $("#empDeduction").val("");
  $("#empId").prop("disabled", false);
  $("#empSave").prop("disabled", true);
  $("#empChange").prop("disabled", true);
  $("#empReset").prop("disabled", true);
  $("#empId").focus();
}
function saveEmployee() {
  var jsonStr = validateData();
  if (jsonStr === "") {
    return;
  }
  var putReqStr = createPUTRequest(
    connectionToken,
    jsonStr,
    employeeDBName,
    employeeRelationName
  );
  //alert(putReqStr);
  jQuery.ajaxSetup({ async: false });
  var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
  //alert(JSON.stringify(resultObj));
  jQuery.ajaxSetup({ async: true });
  resetForm();
}

function getEmpJsonObject() {
  var empid = $("#empId").val();
  var jsonStr = {
    id: empid,
  };
  //alert(JSON.stringify(jsonStr))
  return JSON.stringify(jsonStr);
}

function saveRecordNoToLS(jsonObj) {
  var data = JSON.parse(jsonObj.data);
  localStorage.setItem("record number", data.rec_no);
}

function fillrecord(jsonObj) {
  saveRecordNoToLS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#empName").val(record.name);
  $("#empSalary").val(record.salary);
  $("#empHRA").val(record.hra);
  $("#empDA").val(record.da);
  $("#empDeduction").val(record.deduction);
}

function searchEmployee() {
  var empIdJsonObj = getEmpJsonObject();
  //alert(JSON.stringify(empIdJsonObj))
  var getRequest = createGET_BY_KEYRequest(
    connectionToken,
    employeeDBName,
    employeeRelationName,
    empIdJsonObj
  );
  jQuery.ajaxSetup({ async: false });
  var resObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
  // alert(JSON.stringify(resObj))

  //alert(JSON.stringify(resultObj));
  jQuery.ajaxSetup({ async: true });

  if (resObj.status === 400) {
    $("#empSave").prop("disabled", false);
    $("#empReset").prop("disabled", false);
    $("#empName").focus();
  } else if (resObj.status === 200) {
    $("#empId").prop("disabled", true);
    fillrecord(resObj);

    $("#empChange").prop("disabled", false);
    $("#empReset").prop("disabled", false);
    $("#empName").focus();
  }
}

function changeEmployeeData() {
  $("#empChange").prop("disabled", true);

  jsonChg = validateData();
  var updateReq = createUPDATERecordRequest(
    connectionToken,
    jsonChg,
    employeeDBName,
    employeeRelationName,
    localStorage.getItem("record number")
  );

  jQuery.ajaxSetup({ async: false });
  var resultObj = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseURL, jpdbIML);
  // alert(JSON.stringify(resultObj));
  jQuery.ajaxSetup({ async: true });

  resetForm();
  $("#empId").focus();
}

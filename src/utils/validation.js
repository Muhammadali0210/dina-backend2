export const userValidation = {
    role: {
        notEmpty: {
            errorMessage: "Status must be not empty"
        }
    },
    first_name: {
        notEmpty: {
            errorMessage: "First name must be not empty"
        }     
    },
    last_name: {
        notEmpty: {
            errorMessage: "Last name must be not empty"
        }
    },
    login: {
        notEmpty: {
            errorMessage: "Login must be not empty"
        },
        isLength: {
            options: { min: 5 },
            errorMessage: "Login must be at least 5 characters long"
        }
    },
    password:{
        notEmpty: {
            errorMessage: "Password must be not empty"
        },
        isLength: {
            option: { min: 6 },
            errorMessage: "Password must be at least 6 characters long"
        },

    },
    phone: {
        isString: {
            errorMessage: "Phone must be a string"
        }
    },
    telegram_id: {
        isString: {
            errorMessage:  "TelegramId must be string"
        }
    },
    group_ids: {
    
    }
}

export const groupValidation = {
    name: {
        notEmpty: {
            errorMessage: "Group name must be not empty!"
        }
    },
    degree: {
        notEmpty: {
            errorMessage: "Group degree must be not empty!"
        }
    }
}

export const bookValidation = {
    name: {
        notEmpty: {
            errorMessage: "Book name must be not empty!"
        }
    },
    file: {
        notEmpty: {
            errorMessage: "Book file must be not empty!"
        }
    }
}

export const paymentValidation = {
    status: {
        notEmpty: {
            errorMessage: "Status must be not empty"
        }
    },
    amount: {
        notEmpty: {
            errorMessage: "Amount must be not empty"
        }
    },
    month: {
        notEmpty: {
            errorMessage: "Month must be not empty"
        }
    },
    student_id: {
        notEmpty: {
            errorMessage: "Student must be not empty"
        }
    },
    group_id: {
        notEmpty:{
            errorMessage: "GroupId must be not empty"
        }
    }
}

export const attendanceValidation = {
    status: {
        notEmpty: {
            errorMessage: "Status must be not empty"
        }
    },
    homework: {
        notEmpty: {
            errorMessage: "Homework must be not empty"
        }
    },
    data: {
        notEmpty: {
            errorMessage: "Data must be not empty"
        }
    },
    student_id: {
        notEmpty: {
            errorMessage: "Student must be not empty"
        }
    },
    group_id: {
        notEmpty: {
            errorMessage: "Group must be not empty"
        }
    },
}

export const loginValidation = {
    login: {
        notEmpty: {
            errorMessage: "Login must be not empty"
        },
        isString: {
            errorMessage: "Login must be a string"
        }
    },
    password: {
        notEmpty: {
            errorMessage: "Password must be not empty"
        },
        isString: {
            errorMessage: "Password must be a string"
        }
    }
}


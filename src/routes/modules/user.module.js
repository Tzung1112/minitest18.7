import express, { query } from "express";
const router = express.Router();

let users=[
    {
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "completed": false
    },
    {
        "userId": 1,
        "id": 2,
        "title": "quis ut nam facilis et officia qui",
        "completed": false
    },
    {
        "userId": 1,
        "id": 3,
        "title": "fugiat veniam minus",
        "completed": false
    },
    {
        "userId": 1,
        "id": 4,
        "title": "et porro tempora",
        "completed": true
    },
    {
        "userId": 1,
        "id": 5,
        "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
        "completed": false
    },
    {
        "userId": 1,
        "id": 6,
        "title": "qui ullam ratione quibusdam voluptatem quia omnis",
        "completed": false
    },
    {
        "userId": 1,
        "id": 7,
        "title": "illo expedita consequatur quia in",
        "completed": false
    },
    {
        "userId": 1,
        "id": 8,
        "title": "quo adipisci enim quam ut ab",
        "completed": true
    },
    {
        "userId": 1,
        "id": 9,
        "title": "molestiae perspiciatis ipsa",
        "completed": false
    },
    {
        "userId": 1,
        "id": 10,
        "title": "illo est ratione doloremque quia maiores aut",
        "completed": true
    },
]

function removeVietnameseAccent(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}
router.get('/', (req, res) => {
    if (req.query.id) {
        let result = users.find(user => user.id == req.query.id);
        if (result) {
            return res.status(200).json({
                message: "OK! get user have id: " + req.query.id,
                data: result
            })
        } else {
            return res.status(200).json({
                message: "Get failed, không có user nào tương ứng id: " + req.query.id,
            })
        }

    }

    if (req.query.search) {
        let result = [];

        users.map(user => {
            if (removeVietnameseAccent(user.name + user.age).toLowerCase().includes(removeVietnameseAccent(req.query.search).toLowerCase())) {
                result.push(user);
            }
        })

        return res.status(200).json({
            message: "OK! Result",
            data: result
        })
    }

    return res.status(200).json({
        message: "OK! get all users",
        data: users
    })
})
router.delete("/:userId",(req,res)=>{
    console.log("req.params", req.params.userId);
    if (req.params.userId){
        users = users.filter(user => user.id != req.params.userId)
        res.status(200).json({
            message: "Xoa thanh cong users cos id la" + req.params.userId,
            data: users
        })
    }
})
router.post("/", (req, res) => {
    if(req.body){
        users.push(req.body);
        res.status(200).json({
            message: "Ok",
            data: users
        })
    }
})
router.put('/:userId', (req, res) => {
    if (!req.params.userId) {
        return res.status(500).json(
            {
                message: "Vui lòng truyền userId bạn muốn update"
            }
        )
    }
    let flag = false;
    users = users.map(user => {
        if (user.id == req.params.userId) {
            flag = true
            return {
                ...req.body,
                id:user.id
            }
        }
        return user
    })
    if (flag) {
        return res.status(200).json(
            {
                message: "Cập nhật thành công thông tin của user có id là: " + req.params.userId,
                data: {
                    ...req.body,
                    id: req.params.userId
                }
            }
        )
    } else {
        return res.status(500).json(
            {
                message: "Không tìm thấy user có id là: " + req.params.userId,
            }
        )
    }

})

router.patch('/:userId', (req, res) => {
    let userPatch;
    if (req.params.userId) {
        let flag = false;
        users = users.map(user => {
            if (user.id == req.params.userId) {
                flag = true;
                userPatch = {
                    ...user,
                    ...req.body
                }
                return {
                    ...user,
                    ...req.body
                }
            }
            return user
        })
        if (!flag) {
            return res.status(500).json({
                message: `user có id là: ${req.params.userId} không tồn tại!`
            })
        }

        return res.status(200).json({
            message: "Patch thành công cho user có id là: " + req.params.userId,
            data: userPatch
        })
    }

    return res.status(500).json({
        message: "Vui lòng truyền prams userId"
    })
})
module.exports = router;
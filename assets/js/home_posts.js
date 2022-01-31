let createPost = function () {
    let form = $("#posts-form");
    form.submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/posts/create",
            data: form.serialize(),
            success: function (data) {
                let newPost = newPostDom(data.data.post, data.data.username)
                $('section.all-posts > ul').prepend(newPost)
                deletePost($(`#post-${data.data.post._id} .delete-post-button`))
                createComment($(`#post-${data.data.post._id} > div.comment-box > form`))
                notySuccess(data.message).show()
                form[0].reset()
            },
            error: function (err) {
                notyError(err.responseText).show()
            }
        })
    })
}

let newPostDom = (post, username) => {
    return (`
    <li class="post-card" id="post-${post._id}">

    <div class="heading">
        <div class="post-heading">
            <p class="content">${post.content}</p>
            <p class="author">Posted By ${username}</p>
        </div>
            <div class="delete-container">
                <a class="delete-post-button" href="/posts/destroy/${post._id}"><i class="bi bi-trash-fill"></i>Delete</a>
            </div>
    </div>
    <div class="comment-box">
            <form id="post-${post._id}-comments-form" action="/posts/comments/create" method="post">
                <input type="text" name="content" placeholder="Comment Here..." required>
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Add Comment">
            </form>
    </div>
    <ul id="all-comments-${post._id}" class="all-comments">
    </ul>
</li>
    `)
}

let deletePost = (deleteLink) => {
    $(deleteLink).click(function (e) {
        e.preventDefault();

        $.ajax({
            type: "get",
            url: $(deleteLink).prop("href"),
            success: function (data) {
                $(`li#post-${data.data.post_id}`).remove()
                notySuccess(data.message).show()
            },
            error: function (err) {
                notyError(err.responseText).show()
            }
        })
    })
}
let notySuccess = (message) => {
    return new Noty({
        theme: "relax",
        text: message,
        type: "success",
        layout: "bottomRight",
        timeout: 1500
    })
}
let notyError = (error) => {
    return new Noty({
        theme: "relax",
        text: error,
        type: "error",
        layout: "bottomRight",
        timeout: 1500
    })
}

function newCommentDom(comment, username) {
    return (`
    <li class="comment-list-item" id="comment-list-item-${comment.id}">
        <div class="comment">
            <p class="comment-content"> ${comment.content}</p>
            <p class="comment-author">Commented By - ${username}</p>
        </div>
        <div class="delete-container">
            <a class="delete-comment-button"  href="/posts/comments/destroy/${comment._id}"><i class="bi bi-trash-fill"></i>Delete</a>
        </div>
    </li>
    `)
}

function deleteComment(comment) {
    $(comment).click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "get",
            url: $(comment).prop("href"),
            success: function (data) {
                $(`li#comment-list-item-${data.data.comment_id}`).remove()
                notySuccess(data.message).show()
            },
            error: function (e) {
                notyError(err.responseText).show()
            }
        })
    })
}

let createComment = (form) => {
    form.submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/posts/comments/create",
            data: form.serialize(),
            success: function (data) {
                let newComment = newCommentDom(data.data.comment, data.username)
                $(`#all-comments-${data.data.comment.post}`).prepend(newComment)
                deleteComment($(`#comment-list-item-${data.data.comment.id} .delete-comment-button`))
                notySuccess(data.message).show()
            },
            error: function (err) {
                notyError(err.responseText).show()
            }
        })
        form[0].reset()
    })
}
$(document).ready(function () {
    createPost()
    let forms = $("div.comment-box > form")
    forms.each(function () {
        createComment($(this))
    })
    let postDeleteButtons = $(".delete-post-button")
    postDeleteButtons.each(function () {
        deletePost($(this))
    })
    let commentDeleteButtons = $(".delete-comment-button")
    commentDeleteButtons.each(function () {
        deleteComment($(this))
    })
})

<%- include header %>
<p class="info">
作者：<a href="/u/<%= post.name %>"><%= post.name %></a> |
日期：<%= post.time.minute %>
</p>
<p><%- post.post %></p>
<%- include footer %>
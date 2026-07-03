"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteConfirmDialog({ item, onConfirm, onCancel }) {
  return (
    <AlertDialog open={!!item} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-white text-gray-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900">Delete product?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            This will permanently delete <strong>{item?.name}</strong> and all its images from
            Cloudinary. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

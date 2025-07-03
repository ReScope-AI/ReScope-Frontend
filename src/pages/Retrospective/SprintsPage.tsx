import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useRetrospectiveStore } from '@/stores/retrospectiveStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const SprintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sprints, createSprint } = useRetrospectiveStore();

  const [isOpen, setIsOpen] = React.useState(false);
  const [sprintName, setSprintName] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const handleCreateSprint = () => {
    if (!sprintName || !startDate || !endDate) return;

    createSprint(sprintName, new Date(startDate).getTime(), new Date(endDate).getTime());

    setIsOpen(false);
    setSprintName('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Sprints</h1>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Sprint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sprint</DialogTitle>
              <DialogDescription>Add a new sprint for retrospective.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Sprint Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Sprint 1"
                  value={sprintName}
                  onChange={(e) => setSprintName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSprint}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {sprints.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No sprints found. Create your first sprint to get started.
          </p>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Sprint
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints.map((sprint) => (
            <Card
              key={sprint.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/sprints/${sprint.id}`)}
            >
              <CardHeader>
                <CardTitle>{sprint.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{format(new Date(sprint.startDate), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{format(new Date(sprint.endDate), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions:</span>
                    <span>{sprint.questions.length}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/sprints/${sprint.id}`);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SprintsPage;
